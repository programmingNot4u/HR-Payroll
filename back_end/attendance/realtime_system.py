"""
Real-time Attendance System with WebSocket Support
Handles multiple machines concurrently with event-driven architecture
"""

import asyncio
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Set
from dataclasses import dataclass, asdict
from enum import Enum
import websockets
from websockets.server import WebSocketServerProtocol
from django.conf import settings
from django.utils import timezone as django_timezone

from .models import (
    AttendanceMachine, AttendanceScan, DailyAttendance, Employee,
    AttendanceSettings
)
from .machine_adapters import MachineManager, ScanData, ScanType
from employees.models import Employee

logger = logging.getLogger(__name__)


class EventType(Enum):
    SCAN_RECEIVED = "scan_received"
    ATTENDANCE_UPDATED = "attendance_updated"
    MACHINE_CONNECTED = "machine_connected"
    MACHINE_DISCONNECTED = "machine_disconnected"
    ERROR_OCCURRED = "error_occurred"
    SYSTEM_STATUS = "system_status"


@dataclass
class RealtimeEvent:
    """Real-time event structure"""
    event_type: EventType
    machine_id: str
    data: Dict[str, Any]
    timestamp: datetime
    employee_id: Optional[str] = None


class RealtimeAttendanceSystem:
    """Main real-time attendance system"""
    
    def __init__(self):
        self.machine_manager = MachineManager()
        self.websocket_clients: Set[WebSocketServerProtocol] = set()
        self.is_running = False
        self.scan_queue = asyncio.Queue()
        self.event_queue = asyncio.Queue()
        self.health_check_interval = 30  # seconds
        self.scan_processing_interval = 5  # seconds
        self.last_health_check = None
        
    async def start(self):
        """Start the real-time system"""
        if self.is_running:
            logger.warning("Real-time system is already running")
            return
        
        logger.info("Starting real-time attendance system...")
        self.is_running = True
        
        # Load machines from database
        await self._load_machines()
        
        # Start background tasks
        tasks = [
            asyncio.create_task(self._monitor_machines()),
            asyncio.create_task(self._process_scans()),
            asyncio.create_task(self._process_events()),
            asyncio.create_task(self._health_monitor()),
            asyncio.create_task(self._websocket_server())
        ]
        
        try:
            await asyncio.gather(*tasks)
        except Exception as e:
            logger.error(f"Error in real-time system: {str(e)}")
        finally:
            await self.stop()
    
    async def stop(self):
        """Stop the real-time system"""
        logger.info("Stopping real-time system...")
        self.is_running = False
        
        # Disconnect all machines
        await self.machine_manager.disconnect_all()
        
        # Close all WebSocket connections
        for client in self.websocket_clients.copy():
            await client.close()
        
        logger.info("Real-time system stopped")
    
    async def _load_machines(self):
        """Load machines from database"""
        try:
            machines = AttendanceMachine.objects.filter(status='active')
            for machine in machines:
                config = {
                    'machine_id': machine.machine_id,
                    'ip_address': machine.ip_address,
                    'port': machine.port,
                    'username': machine.config.get('username', ''),
                    'password': machine.config.get('password', ''),
                    'config': machine.config
                }
                
                await self.machine_manager.add_machine(
                    machine.machine_id,
                    machine.machine_type,
                    config
                )
            
            # Connect to all machines
            connection_results = await self.machine_manager.connect_all()
            logger.info(f"Machine connection results: {connection_results}")
            
        except Exception as e:
            logger.error(f"Error loading machines: {str(e)}")
    
    async def _monitor_machines(self):
        """Monitor all machines for new scans"""
        logger.info("Starting machine monitoring...")
        
        while self.is_running:
            try:
                # Get scans from all machines
                scans = await self.machine_manager.get_all_scans()
                
                # Process each scan
                for scan in scans:
                    await self.scan_queue.put(scan)
                    logger.debug(f"Queued scan: {scan.employee_id} at {scan.scan_time}")
                
                # Wait before next check
                await asyncio.sleep(self.scan_processing_interval)
                
            except Exception as e:
                logger.error(f"Error in machine monitoring: {str(e)}")
                await asyncio.sleep(5)  # Wait before retrying
    
    async def _process_scans(self):
        """Process queued scans"""
        logger.info("Starting scan processing...")
        
        while self.is_running:
            try:
                # Get scan from queue (with timeout)
                scan = await asyncio.wait_for(
                    self.scan_queue.get(), 
                    timeout=1.0
                )
                
                # Process the scan
                await self._process_single_scan(scan)
                
            except asyncio.TimeoutError:
                # No scans in queue, continue
                continue
            except Exception as e:
                logger.error(f"Error processing scan: {str(e)}")
    
    async def _process_single_scan(self, scan: ScanData):
        """Process a single scan"""
        try:
            # Validate scan
            if not self._validate_scan(scan):
                logger.warning(f"Invalid scan: {scan.employee_id} at {scan.scan_time}")
                return
            
            # Find employee
            try:
                employee = Employee.objects.get(employee_id=scan.employee_id)
            except Employee.DoesNotExist:
                logger.warning(f"Employee not found: {scan.employee_id}")
                return
            
            # Find machine
            try:
                machine = AttendanceMachine.objects.get(machine_id=scan.machine_id)
            except AttendanceMachine.DoesNotExist:
                logger.warning(f"Machine not found: {scan.machine_id}")
                return
            
            # Create attendance scan record
            attendance_scan = AttendanceScan.objects.create(
                employee=employee,
                machine=machine,
                scan_time=scan.scan_time,
                scan_type=scan.scan_type.value,
                raw_data=scan.raw_data,
                is_processed=False
            )
            
            # Update daily attendance
            await self._update_daily_attendance(employee, scan)
            
            # Mark scan as processed
            attendance_scan.is_processed = True
            attendance_scan.save()
            
            # Create event
            event = RealtimeEvent(
                event_type=EventType.SCAN_RECEIVED,
                machine_id=scan.machine_id,
                data={
                    'scan_id': str(attendance_scan.id),
                    'employee_id': scan.employee_id,
                    'employee_name': employee.user.full_name,
                    'scan_time': scan.scan_time.isoformat(),
                    'scan_type': scan.scan_type.value
                },
                timestamp=django_timezone.now(),
                employee_id=scan.employee_id
            )
            
            await self.event_queue.put(event)
            logger.info(f"Processed scan: {scan.employee_id} - {scan.scan_type.value}")
            
        except Exception as e:
            logger.error(f"Error processing single scan: {str(e)}")
    
    def _validate_scan(self, scan: ScanData) -> bool:
        """Validate scan data"""
        if not scan.employee_id or not scan.scan_time:
            return False
        
        # Check if scan is not too old (more than 24 hours)
        now = django_timezone.now()
        if (now - scan.scan_time).total_seconds() > 24 * 3600:
            return False
        
        return True
    
    async def _update_daily_attendance(self, employee: Employee, scan: ScanData):
        """Update daily attendance record"""
        try:
            date = scan.scan_time.date()
            
            # Get or create daily attendance record
            daily_attendance, created = DailyAttendance.objects.get_or_create(
                employee=employee,
                date=date,
                defaults={'status': 'Absent'}
            )
            
            # Update scan counts
            daily_attendance.total_scans += 1
            
            if scan.scan_type in [ScanType.IN, ScanType.BREAK_OUT, ScanType.OVERTIME_IN]:
                daily_attendance.check_in_count += 1
                if not daily_attendance.first_check_in:
                    daily_attendance.first_check_in = scan.scan_time.time()
            elif scan.scan_type in [ScanType.OUT, ScanType.BREAK_IN, ScanType.OVERTIME_OUT]:
                daily_attendance.check_out_count += 1
                daily_attendance.last_check_out = scan.scan_time.time()
            
            # Calculate working hours and overtime
            if daily_attendance.first_check_in and daily_attendance.last_check_out:
                daily_attendance.total_working_hours = daily_attendance.calculate_working_hours()
                daily_attendance.overtime_hours = daily_attendance.calculate_overtime()
                daily_attendance.extra_overtime_hours = daily_attendance.calculate_extra_overtime()
                
                # Update eligibility flags
                daily_attendance.snacks_eligible = daily_attendance.extra_overtime_hours >= 1.0
                daily_attendance.night_bill_eligible = daily_attendance.extra_overtime_hours >= 5.0
                
                # Update status
                if daily_attendance.first_check_in <= django_timezone.now().time().replace(hour=8, minute=0):
                    daily_attendance.status = 'Present-OnTime'
                elif daily_attendance.first_check_in <= django_timezone.now().time().replace(hour=8, minute=5):
                    daily_attendance.status = 'Present-Considered'
                else:
                    daily_attendance.status = 'Present-Late'
            
            daily_attendance.save()
            
        except Exception as e:
            logger.error(f"Error updating daily attendance: {str(e)}")
    
    async def _process_events(self):
        """Process real-time events"""
        logger.info("Starting event processing...")
        
        while self.is_running:
            try:
                # Get event from queue
                event = await asyncio.wait_for(
                    self.event_queue.get(),
                    timeout=1.0
                )
                
                # Broadcast event to all WebSocket clients
                await self._broadcast_event(event)
                
            except asyncio.TimeoutError:
                # No events in queue, continue
                continue
            except Exception as e:
                logger.error(f"Error processing event: {str(e)}")
    
    async def _broadcast_event(self, event: RealtimeEvent):
        """Broadcast event to all WebSocket clients"""
        if not self.websocket_clients:
            return
        
        message = json.dumps({
            'type': event.event_type.value,
            'machine_id': event.machine_id,
            'data': event.data,
            'timestamp': event.timestamp.isoformat(),
            'employee_id': event.employee_id
        })
        
        # Send to all connected clients
        disconnected_clients = set()
        for client in self.websocket_clients:
            try:
                await client.send(message)
            except websockets.exceptions.ConnectionClosed:
                disconnected_clients.add(client)
            except Exception as e:
                logger.error(f"Error sending to client: {str(e)}")
                disconnected_clients.add(client)
        
        # Remove disconnected clients
        self.websocket_clients -= disconnected_clients
    
    async def _health_monitor(self):
        """Monitor system health"""
        logger.info("Starting health monitor...")
        
        while self.is_running:
            try:
                # Test all machine connections
                connection_results = await self.machine_manager.test_all_connections()
                
                # Update machine status in database
                for machine_id, is_connected in connection_results.items():
                    try:
                        machine = AttendanceMachine.objects.get(machine_id=machine_id)
                        machine.is_connected = is_connected
                        if is_connected:
                            machine.last_sync = django_timezone.now()
                        machine.save()
                    except AttendanceMachine.DoesNotExist:
                        continue
                
                # Create health status event
                event = RealtimeEvent(
                    event_type=EventType.SYSTEM_STATUS,
                    machine_id="system",
                    data={
                        'machines': connection_results,
                        'total_clients': len(self.websocket_clients),
                        'queue_size': self.scan_queue.qsize()
                    },
                    timestamp=django_timezone.now()
                )
                
                await self.event_queue.put(event)
                self.last_health_check = django_timezone.now()
                
                # Wait before next health check
                await asyncio.sleep(self.health_check_interval)
                
            except Exception as e:
                logger.error(f"Error in health monitor: {str(e)}")
                await asyncio.sleep(30)
    
    async def _websocket_server(self):
        """Start WebSocket server"""
        logger.info("Starting WebSocket server...")
        
        async def handle_client(websocket: WebSocketServerProtocol, path: str):
            """Handle WebSocket client connection"""
            self.websocket_clients.add(websocket)
            logger.info(f"Client connected: {websocket.remote_address}")
            
            try:
                # Send welcome message
                welcome_event = RealtimeEvent(
                    event_type=EventType.SYSTEM_STATUS,
                    machine_id="system",
                    data={'message': 'Connected to real-time attendance system'},
                    timestamp=django_timezone.now()
                )
                await websocket.send(json.dumps({
                    'type': welcome_event.event_type.value,
                    'machine_id': welcome_event.machine_id,
                    'data': welcome_event.data,
                    'timestamp': welcome_event.timestamp.isoformat()
                }))
                
                # Keep connection alive
                await websocket.wait_closed()
                
            except websockets.exceptions.ConnectionClosed:
                pass
            except Exception as e:
                logger.error(f"Error handling WebSocket client: {str(e)}")
            finally:
                self.websocket_clients.discard(websocket)
                logger.info(f"Client disconnected: {websocket.remote_address}")
        
        # Start WebSocket server
        server = await websockets.serve(
            handle_client,
            "localhost",
            8765,  # WebSocket port
            ping_interval=20,
            ping_timeout=10
        )
        
        logger.info("WebSocket server started on ws://localhost:8765")
        
        # Keep server running
        await server.wait_closed()
    
    async def add_websocket_client(self, websocket: WebSocketServerProtocol):
        """Add a WebSocket client"""
        self.websocket_clients.add(websocket)
    
    async def remove_websocket_client(self, websocket: WebSocketServerProtocol):
        """Remove a WebSocket client"""
        self.websocket_clients.discard(websocket)
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get current system status"""
        return {
            'is_running': self.is_running,
            'total_machines': len(self.machine_manager.adapters),
            'connected_machines': sum(1 for adapter in self.machine_manager.adapters.values() if adapter.is_connected),
            'total_clients': len(self.websocket_clients),
            'queue_size': self.scan_queue.qsize(),
            'last_health_check': self.last_health_check.isoformat() if self.last_health_check else None
        }


# Global instance
realtime_system = RealtimeAttendanceSystem()


async def start_realtime_system():
    """Start the real-time attendance system"""
    await realtime_system.start()


async def stop_realtime_system():
    """Stop the real-time attendance system"""
    await realtime_system.stop()


def get_realtime_system() -> RealtimeAttendanceSystem:
    """Get the global real-time system instance"""
    return realtime_system

