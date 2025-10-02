"""
Universal Machine Adapters for Fingerprint Attendance Systems
Supports multiple machine types with a unified interface
"""

import asyncio
import aiohttp
import socket
import json
import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class ScanType(Enum):
    IN = "IN"
    OUT = "OUT"
    BREAK_IN = "BREAK_IN"
    BREAK_OUT = "BREAK_OUT"
    OVERTIME_IN = "OVERTIME_IN"
    OVERTIME_OUT = "OVERTIME_OUT"


@dataclass
class ScanData:
    """Standardized scan data structure"""
    employee_id: str
    scan_time: datetime
    scan_type: ScanType
    machine_id: str
    raw_data: Dict[str, Any]
    is_valid: bool = True
    error_message: Optional[str] = None


class BaseMachineAdapter(ABC):
    """Base class for all machine adapters"""
    
    def __init__(self, machine_config: Dict[str, Any]):
        self.machine_id = machine_config.get('machine_id')
        self.ip_address = machine_config.get('ip_address')
        self.port = machine_config.get('port', 80)
        self.username = machine_config.get('username', '')
        self.password = machine_config.get('password', '')
        self.config = machine_config.get('config', {})
        self.is_connected = False
        self.last_sync = None
        
    @abstractmethod
    async def connect(self) -> bool:
        """Connect to the machine"""
        pass
    
    @abstractmethod
    async def disconnect(self) -> bool:
        """Disconnect from the machine"""
        pass
    
    @abstractmethod
    async def get_scans(self, from_time: Optional[datetime] = None) -> List[ScanData]:
        """Get attendance scans from the machine"""
        pass
    
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test machine connection"""
        pass
    
    def _parse_scan_type(self, raw_scan_type: str) -> ScanType:
        """Parse machine-specific scan type to standard format"""
        scan_type_mapping = {
            'IN': ScanType.IN,
            'OUT': ScanType.OUT,
            'BREAK_IN': ScanType.BREAK_IN,
            'BREAK_OUT': ScanType.BREAK_OUT,
            'OVERTIME_IN': ScanType.OVERTIME_IN,
            'OVERTIME_OUT': ScanType.OVERTIME_OUT,
            '1': ScanType.IN,  # Some machines use numeric codes
            '2': ScanType.OUT,
            '0': ScanType.IN,
            'check_in': ScanType.IN,
            'check_out': ScanType.OUT,
        }
        return scan_type_mapping.get(raw_scan_type.upper(), ScanType.IN)


class SimulatedMachineAdapter(BaseMachineAdapter):
    """Simulated machine for testing and development"""
    
    def __init__(self, machine_config: Dict[str, Any]):
        super().__init__(machine_config)
        self.scan_counter = 0
        self.employees = [
            'EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005',
            'EMP006', 'EMP007', 'EMP008', 'EMP009', 'EMP010'
        ]
    
    async def connect(self) -> bool:
        """Simulate connection"""
        await asyncio.sleep(0.1)  # Simulate network delay
        self.is_connected = True
        logger.info(f"Simulated machine {self.machine_id} connected")
        return True
    
    async def disconnect(self) -> bool:
        """Simulate disconnection"""
        self.is_connected = False
        logger.info(f"Simulated machine {self.machine_id} disconnected")
        return True
    
    async def get_scans(self, from_time: Optional[datetime] = None) -> List[ScanData]:
        """Generate simulated scan data"""
        if not self.is_connected:
            return []
        
        scans = []
        current_time = datetime.now(timezone.utc)
        
        # Generate 1-3 random scans
        import random
        num_scans = random.randint(1, 3)
        
        for _ in range(num_scans):
            self.scan_counter += 1
            employee_id = random.choice(self.employees)
            scan_time = current_time - timedelta(minutes=random.randint(0, 30))
            scan_type = random.choice([ScanType.IN, ScanType.OUT])
            
            scan = ScanData(
                employee_id=employee_id,
                scan_time=scan_time,
                scan_type=scan_type,
                machine_id=self.machine_id,
                raw_data={
                    'simulated': True,
                    'scan_number': self.scan_counter,
                    'random_factor': random.random()
                }
            )
            scans.append(scan)
        
        return scans
    
    async def test_connection(self) -> bool:
        """Test simulated connection"""
        return True


class ZKTecoAdapter(BaseMachineAdapter):
    """Adapter for ZKTeco fingerprint machines"""
    
    def __init__(self, machine_config: Dict[str, Any]):
        super().__init__(machine_config)
        self.session = None
        self.base_url = f"http://{self.ip_address}:{self.port}"
    
    async def connect(self) -> bool:
        """Connect to ZKTeco machine via HTTP API"""
        try:
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=10),
                auth=aiohttp.BasicAuth(self.username, self.password)
            )
            
            # Test connection
            async with self.session.get(f"{self.base_url}/cgi-bin/attendance.cgi") as response:
                if response.status == 200:
                    self.is_connected = True
                    self.last_sync = datetime.now(timezone.utc)
                    logger.info(f"ZKTeco machine {self.machine_id} connected")
                    return True
                else:
                    logger.error(f"Failed to connect to ZKTeco machine {self.machine_id}: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"Error connecting to ZKTeco machine {self.machine_id}: {str(e)}")
            return False
    
    async def disconnect(self) -> bool:
        """Disconnect from ZKTeco machine"""
        if self.session:
            await self.session.close()
            self.session = None
        self.is_connected = False
        logger.info(f"ZKTeco machine {self.machine_id} disconnected")
        return True
    
    async def get_scans(self, from_time: Optional[datetime] = None) -> List[ScanData]:
        """Get scans from ZKTeco machine"""
        if not self.is_connected or not self.session:
            return []
        
        try:
            # ZKTeco API endpoint for attendance data
            url = f"{self.base_url}/cgi-bin/attendance.cgi"
            params = {}
            if from_time:
                params['from'] = from_time.strftime('%Y-%m-%d %H:%M:%S')
            
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_zkteco_data(data)
                else:
                    logger.error(f"Failed to get scans from ZKTeco machine {self.machine_id}: {response.status}")
                    return []
        except Exception as e:
            logger.error(f"Error getting scans from ZKTeco machine {self.machine_id}: {str(e)}")
            return []
    
    def _parse_zkteco_data(self, data: Dict[str, Any]) -> List[ScanData]:
        """Parse ZKTeco API response"""
        scans = []
        
        if 'attendance' in data:
            for record in data['attendance']:
                try:
                    scan_time = datetime.fromisoformat(record['time'].replace('Z', '+00:00'))
                    scan_type = self._parse_scan_type(record.get('type', 'IN'))
                    
                    scan = ScanData(
                        employee_id=record['user_id'],
                        scan_time=scan_time,
                        scan_type=scan_type,
                        machine_id=self.machine_id,
                        raw_data=record
                    )
                    scans.append(scan)
                except Exception as e:
                    logger.error(f"Error parsing ZKTeco scan record: {str(e)}")
                    continue
        
        return scans
    
    async def test_connection(self) -> bool:
        """Test ZKTeco machine connection"""
        try:
            if not self.session:
                return False
            
            async with self.session.get(f"{self.base_url}/cgi-bin/status.cgi") as response:
                return response.status == 200
        except Exception:
            return False


class SupremaAdapter(BaseMachineAdapter):
    """Adapter for Suprema fingerprint machines"""
    
    def __init__(self, machine_config: Dict[str, Any]):
        super().__init__(machine_config)
        self.session = None
        self.base_url = f"http://{self.ip_address}:{self.port}"
    
    async def connect(self) -> bool:
        """Connect to Suprema machine via HTTP API"""
        try:
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=10),
                auth=aiohttp.BasicAuth(self.username, self.password)
            )
            
            # Test connection
            async with self.session.get(f"{self.base_url}/api/status") as response:
                if response.status == 200:
                    self.is_connected = True
                    self.last_sync = datetime.now(timezone.utc)
                    logger.info(f"Suprema machine {self.machine_id} connected")
                    return True
                else:
                    logger.error(f"Failed to connect to Suprema machine {self.machine_id}: {response.status}")
                    return False
        except Exception as e:
            logger.error(f"Error connecting to Suprema machine {self.machine_id}: {str(e)}")
            return False
    
    async def disconnect(self) -> bool:
        """Disconnect from Suprema machine"""
        if self.session:
            await self.session.close()
            self.session = None
        self.is_connected = False
        logger.info(f"Suprema machine {self.machine_id} disconnected")
        return True
    
    async def get_scans(self, from_time: Optional[datetime] = None) -> List[ScanData]:
        """Get scans from Suprema machine"""
        if not self.is_connected or not self.session:
            return []
        
        try:
            # Suprema API endpoint for attendance data
            url = f"{self.base_url}/api/attendance"
            params = {}
            if from_time:
                params['from'] = from_time.isoformat()
            
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_suprema_data(data)
                else:
                    logger.error(f"Failed to get scans from Suprema machine {self.machine_id}: {response.status}")
                    return []
        except Exception as e:
            logger.error(f"Error getting scans from Suprema machine {self.machine_id}: {str(e)}")
            return []
    
    def _parse_suprema_data(self, data: Dict[str, Any]) -> List[ScanData]:
        """Parse Suprema API response"""
        scans = []
        
        if 'records' in data:
            for record in data['records']:
                try:
                    scan_time = datetime.fromisoformat(record['timestamp'].replace('Z', '+00:00'))
                    scan_type = self._parse_scan_type(record.get('event_type', 'IN'))
                    
                    scan = ScanData(
                        employee_id=record['user_id'],
                        scan_time=scan_time,
                        scan_type=scan_type,
                        machine_id=self.machine_id,
                        raw_data=record
                    )
                    scans.append(scan)
                except Exception as e:
                    logger.error(f"Error parsing Suprema scan record: {str(e)}")
                    continue
        
        return scans
    
    async def test_connection(self) -> bool:
        """Test Suprema machine connection"""
        try:
            if not self.session:
                return False
            
            async with self.session.get(f"{self.base_url}/api/status") as response:
                return response.status == 200
        except Exception:
            return False


class GenericTCPAdapter(BaseMachineAdapter):
    """Generic TCP adapter for machines with custom protocols"""
    
    def __init__(self, machine_config: Dict[str, Any]):
        super().__init__(machine_config)
        self.socket = None
        self.protocol = machine_config.get('protocol', 'custom')
    
    async def connect(self) -> bool:
        """Connect to machine via TCP"""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.settimeout(10)
            self.socket.connect((self.ip_address, self.port))
            self.is_connected = True
            self.last_sync = datetime.now(timezone.utc)
            logger.info(f"Generic TCP machine {self.machine_id} connected")
            return True
        except Exception as e:
            logger.error(f"Error connecting to Generic TCP machine {self.machine_id}: {str(e)}")
            return False
    
    async def disconnect(self) -> bool:
        """Disconnect from machine"""
        if self.socket:
            self.socket.close()
            self.socket = None
        self.is_connected = False
        logger.info(f"Generic TCP machine {self.machine_id} disconnected")
        return True
    
    async def get_scans(self, from_time: Optional[datetime] = None) -> List[ScanData]:
        """Get scans from machine via TCP"""
        if not self.is_connected or not self.socket:
            return []
        
        try:
            # Send request for attendance data
            request = self._build_request(from_time)
            self.socket.send(request.encode())
            
            # Receive response
            response = self.socket.recv(4096).decode()
            return self._parse_tcp_response(response)
        except Exception as e:
            logger.error(f"Error getting scans from Generic TCP machine {self.machine_id}: {str(e)}")
            return []
    
    def _build_request(self, from_time: Optional[datetime] = None) -> str:
        """Build TCP request based on protocol"""
        if self.protocol == 'custom':
            # Custom protocol implementation
            timestamp = from_time.isoformat() if from_time else ''
            return f"GET_ATTENDANCE|{timestamp}\n"
        else:
            # Default protocol
            return "GET_ATTENDANCE\n"
    
    def _parse_tcp_response(self, response: str) -> List[ScanData]:
        """Parse TCP response"""
        scans = []
        lines = response.strip().split('\n')
        
        for line in lines:
            try:
                parts = line.split('|')
                if len(parts) >= 3:
                    employee_id = parts[0]
                    scan_time = datetime.fromisoformat(parts[1])
                    scan_type = self._parse_scan_type(parts[2])
                    
                    scan = ScanData(
                        employee_id=employee_id,
                        scan_time=scan_time,
                        scan_type=scan_type,
                        machine_id=self.machine_id,
                        raw_data={'raw_line': line}
                    )
                    scans.append(scan)
            except Exception as e:
                logger.error(f"Error parsing TCP response line: {str(e)}")
                continue
        
        return scans
    
    async def test_connection(self) -> bool:
        """Test TCP connection"""
        try:
            if not self.socket:
                return False
            
            # Send ping request
            self.socket.send(b"PING\n")
            response = self.socket.recv(1024)
            return b"PONG" in response
        except Exception:
            return False


class MachineAdapterFactory:
    """Factory for creating machine adapters"""
    
    @staticmethod
    def create_adapter(machine_type: str, machine_config: Dict[str, Any]) -> BaseMachineAdapter:
        """Create appropriate adapter based on machine type"""
        adapters = {
            'simulated': SimulatedMachineAdapter,
            'zkteco': ZKTecoAdapter,
            'suprema': SupremaAdapter,
            'generic': GenericTCPAdapter,
        }
        
        adapter_class = adapters.get(machine_type.lower())
        if not adapter_class:
            raise ValueError(f"Unsupported machine type: {machine_type}")
        
        return adapter_class(machine_config)


class MachineManager:
    """Manages multiple machine adapters"""
    
    def __init__(self):
        self.adapters: Dict[str, BaseMachineAdapter] = {}
        self.is_running = False
    
    async def add_machine(self, machine_id: str, machine_type: str, machine_config: Dict[str, Any]) -> bool:
        """Add a machine to the manager"""
        try:
            adapter = MachineAdapterFactory.create_adapter(machine_type, machine_config)
            self.adapters[machine_id] = adapter
            logger.info(f"Added machine {machine_id} of type {machine_type}")
            return True
        except Exception as e:
            logger.error(f"Failed to add machine {machine_id}: {str(e)}")
            return False
    
    async def connect_all(self) -> Dict[str, bool]:
        """Connect to all machines"""
        results = {}
        for machine_id, adapter in self.adapters.items():
            try:
                results[machine_id] = await adapter.connect()
            except Exception as e:
                logger.error(f"Failed to connect machine {machine_id}: {str(e)}")
                results[machine_id] = False
        return results
    
    async def disconnect_all(self) -> Dict[str, bool]:
        """Disconnect from all machines"""
        results = {}
        for machine_id, adapter in self.adapters.items():
            try:
                results[machine_id] = await adapter.disconnect()
            except Exception as e:
                logger.error(f"Failed to disconnect machine {machine_id}: {str(e)}")
                results[machine_id] = False
        return results
    
    async def get_all_scans(self, from_time: Optional[datetime] = None) -> List[ScanData]:
        """Get scans from all machines"""
        all_scans = []
        
        # Use asyncio.gather for concurrent execution
        tasks = []
        for machine_id, adapter in self.adapters.items():
            if adapter.is_connected:
                tasks.append(adapter.get_scans(from_time))
        
        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for result in results:
                if isinstance(result, list):
                    all_scans.extend(result)
                elif isinstance(result, Exception):
                    logger.error(f"Error getting scans: {str(result)}")
        
        return all_scans
    
    async def test_all_connections(self) -> Dict[str, bool]:
        """Test all machine connections"""
        results = {}
        tasks = []
        
        for machine_id, adapter in self.adapters.items():
            tasks.append((machine_id, adapter.test_connection()))
        
        if tasks:
            test_results = await asyncio.gather(*[task[1] for task in tasks], return_exceptions=True)
            for i, result in enumerate(test_results):
                machine_id = tasks[i][0]
                if isinstance(result, bool):
                    results[machine_id] = result
                else:
                    logger.error(f"Error testing connection for {machine_id}: {str(result)}")
                    results[machine_id] = False
        
        return results
