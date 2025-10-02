from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from django.core.paginator import Paginator
from datetime import datetime, date, timedelta
import json

from .models import (
    AttendanceMachine, AttendanceScan, DailyAttendance, LeavePolicy,
    LeaveBalance, LeaveRequest, Holiday, AttendanceSettings
)
from .serializers import (
    AttendanceMachineSerializer, AttendanceScanSerializer, DailyAttendanceSerializer,
    LeavePolicySerializer, LeaveBalanceSerializer, LeaveRequestSerializer,
    HolidaySerializer, AttendanceSettingsSerializer, AttendanceSummarySerializer,
    TimesheetSerializer, LeaveBalanceSummarySerializer
)
from employees.models import Employee
from .realtime_system import get_realtime_system


# ===== ATTENDANCE MACHINE VIEWS =====

class AttendanceMachineListCreateView(generics.ListCreateAPIView):
    """List and create attendance machines"""
    queryset = AttendanceMachine.objects.all()
    serializer_class = AttendanceMachineSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['machine_type', 'status', 'is_connected', 'department']
    search_fields = ['machine_id', 'name', 'location', 'ip_address']
    ordering_fields = ['name', 'created_at', 'last_sync']
    ordering = ['name']


class AttendanceMachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an attendance machine"""
    queryset = AttendanceMachine.objects.all()
    serializer_class = AttendanceMachineSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_machine_connection(request, machine_id):
    """Test connection to a specific machine"""
    try:
        machine = AttendanceMachine.objects.get(machine_id=machine_id)
        
        # For now, just return the current status
        # In a real implementation, you would test the actual connection
        return Response({
            'machine_id': machine_id,
            'is_connected': machine.is_connected,
            'last_sync': machine.last_sync
        })
            
    except AttendanceMachine.DoesNotExist:
        return Response({
            'error': 'Machine not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===== DAILY ATTENDANCE VIEWS =====

class DailyAttendanceListCreateView(generics.ListCreateAPIView):
    """List and create daily attendance records"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['employee', 'date', 'status', 'employee__department', 'employee__level_of_work']
    search_fields = ['employee__employee_id', 'employee__user__first_name', 'employee__user__last_name']
    ordering_fields = ['date', 'employee', 'total_working_hours']
    ordering = ['-date', 'employee']
    
    def get_queryset(self):
        """Filter attendance based on user role"""
        queryset = DailyAttendance.objects.select_related(
            'employee__user', 'employee__department', 'employee__designation', 'edited_by'
        )
        
        # Role-based filtering
        if self.request.user.role == 'employee':
            # Employees can only see their own attendance
            return queryset.filter(employee__user=self.request.user)
        elif self.request.user.role == 'department_head':
            # Department heads can see their department's attendance
            return queryset.filter(employee__department__head=self.request.user)
        elif self.request.user.role in ['hr_staff', 'hr_manager', 'super_admin']:
            # HR staff can see all attendance
            return queryset
        else:
            return queryset.filter(employee__user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DailyAttendanceSerializer
        return DailyAttendanceSerializer


class DailyAttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a daily attendance record"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter attendance based on user role"""
        queryset = DailyAttendance.objects.select_related(
            'employee__user', 'employee__department', 'employee__designation', 'edited_by'
        )
        
        # Role-based filtering
        if self.request.user.role == 'employee':
            return queryset.filter(employee__user=self.request.user)
        elif self.request.user.role == 'department_head':
            return queryset.filter(employee__department__head=self.request.user)
        elif self.request.user.role in ['hr_staff', 'hr_manager', 'super_admin']:
            return queryset
        else:
            return queryset.filter(employee__user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DailyAttendanceSerializer
        return DailyAttendanceSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_attendance_summary(request):
    """Get daily attendance summary for a specific date"""
    date_str = request.query_params.get('date')
    if not date_str:
        return Response({'error': 'Date parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get attendance records for the date
    queryset = DailyAttendance.objects.filter(date=target_date).select_related(
        'employee__user', 'employee__department', 'employee__designation'
    )
    
    # Apply role-based filtering
    if request.user.role == 'employee':
        queryset = queryset.filter(employee__user=request.user)
    elif request.user.role == 'department_head':
        queryset = queryset.filter(employee__department__head=request.user)
    # HR staff can see all
    
    # Get scans for the date
    scans = AttendanceScan.objects.filter(
        scan_time__date=target_date
    ).select_related('employee__user', 'machine')
    
    # Build summary data
    summary_data = []
    for attendance in queryset:
        employee_scans = scans.filter(employee=attendance.employee)
        scan_list = []
        
        for scan in employee_scans:
            scan_list.append({
                'time': scan.scan_time.strftime('%H:%M'),
                'type': scan.scan_type
            })
        
        summary_data.append({
            'employee_id': attendance.employee.employee_id,
            'employee_name': attendance.employee.user.full_name,
            'department': attendance.employee.department.name,
            'designation': attendance.employee.designation.name,
            'level_of_work': attendance.employee.level_of_work,
            'date': attendance.date.strftime('%Y-%m-%d'),
            'status': attendance.status,
            'check_in': attendance.first_check_in.strftime('%H:%M') if attendance.first_check_in else None,
            'check_out': attendance.last_check_out.strftime('%H:%M') if attendance.last_check_out else None,
            'working_hours': float(attendance.total_working_hours),
            'overtime': float(attendance.overtime_hours),
            'extra_overtime': float(attendance.extra_overtime_hours),
            'attendance_count': attendance.total_scans,
            'scans': scan_list
        })
    
    return Response(summary_data)


# ===== LEAVE MANAGEMENT VIEWS =====

class LeavePolicyListCreateView(generics.ListCreateAPIView):
    """List and create leave policies"""
    queryset = LeavePolicy.objects.all()
    serializer_class = LeavePolicySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'requires_approval', 'gender_restriction']
    search_fields = ['leave_type', 'description']
    ordering = ['leave_type']


class LeavePolicyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a leave policy"""
    queryset = LeavePolicy.objects.all()
    serializer_class = LeavePolicySerializer
    permission_classes = [IsAuthenticated]


class LeaveBalanceListCreateView(generics.ListCreateAPIView):
    """List and create leave balances"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['employee', 'leave_policy', 'year']
    search_fields = ['employee__employee_id', 'employee__user__first_name', 'employee__user__last_name']
    ordering = ['employee', 'leave_policy', 'year']
    
    def get_queryset(self):
        """Filter leave balances based on user role"""
        queryset = LeaveBalance.objects.select_related(
            'employee__user', 'employee__department', 'leave_policy'
        )
        
        # Role-based filtering
        if self.request.user.role == 'employee':
            return queryset.filter(employee__user=self.request.user)
        elif self.request.user.role == 'department_head':
            return queryset.filter(employee__department__head=self.request.user)
        elif self.request.user.role in ['hr_staff', 'hr_manager', 'super_admin']:
            return queryset
        else:
            return queryset.filter(employee__user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LeaveBalanceSerializer
        return LeaveBalanceSerializer


class LeaveRequestListCreateView(generics.ListCreateAPIView):
    """List and create leave requests"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['employee', 'leave_policy', 'status', 'priority', 'start_date']
    search_fields = ['employee__employee_id', 'employee__user__first_name', 'employee__user__last_name', 'reason']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter leave requests based on user role"""
        queryset = LeaveRequest.objects.select_related(
            'employee__user', 'employee__department', 'leave_policy', 'requested_by', 'approved_by'
        )
        
        # Role-based filtering
        if self.request.user.role == 'employee':
            return queryset.filter(employee__user=self.request.user)
        elif self.request.user.role == 'department_head':
            return queryset.filter(employee__department__head=self.request.user)
        elif self.request.user.role in ['hr_staff', 'hr_manager', 'super_admin']:
            return queryset
        else:
            return queryset.filter(employee__user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LeaveRequestSerializer
        return LeaveRequestSerializer


class LeaveRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a leave request"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter leave requests based on user role"""
        queryset = LeaveRequest.objects.select_related(
            'employee__user', 'employee__department', 'leave_policy', 'requested_by', 'approved_by'
        )
        
        # Role-based filtering
        if self.request.user.role == 'employee':
            return queryset.filter(employee__user=self.request.user)
        elif self.request.user.role == 'department_head':
            return queryset.filter(employee__department__head=self.request.user)
        elif self.request.user.role in ['hr_staff', 'hr_manager', 'super_admin']:
            return queryset
        else:
            return queryset.filter(employee__user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return LeaveRequestSerializer
        return LeaveRequestSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_leave_request(request, request_id):
    """Approve a leave request"""
    try:
        leave_request = LeaveRequest.objects.get(id=request_id)
        
        # Check permissions
        if request.user.role not in ['hr_staff', 'hr_manager', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        if leave_request.status != 'pending':
            return Response({'error': 'Only pending requests can be approved'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Approve the request
        leave_request.status = 'approved'
        leave_request.approved_by = request.user
        leave_request.approved_at = timezone.now()
        leave_request.save()
        
        # Update leave balance
        try:
            balance = LeaveBalance.objects.get(
                employee=leave_request.employee,
                leave_policy=leave_request.leave_policy,
                year=leave_request.start_date.year
            )
            balance.used_days += leave_request.total_days
            balance.save()
        except LeaveBalance.DoesNotExist:
            pass  # Handle missing balance
        
        return Response({'message': 'Leave request approved successfully'})
        
    except LeaveRequest.DoesNotExist:
        return Response({'error': 'Leave request not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_leave_request(request, request_id):
    """Reject a leave request"""
    try:
        leave_request = LeaveRequest.objects.get(id=request_id)
        
        # Check permissions
        if request.user.role not in ['hr_staff', 'hr_manager', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        if leave_request.status != 'pending':
            return Response({'error': 'Only pending requests can be rejected'}, status=status.HTTP_400_BAD_REQUEST)
        
        rejection_reason = request.data.get('rejection_reason', '')
        
        # Reject the request
        leave_request.status = 'rejected'
        leave_request.approved_by = request.user
        leave_request.approved_at = timezone.now()
        leave_request.rejection_reason = rejection_reason
        leave_request.save()
        
        return Response({'message': 'Leave request rejected successfully'})
        
    except LeaveRequest.DoesNotExist:
        return Response({'error': 'Leave request not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===== HOLIDAY VIEWS =====

class HolidayListCreateView(generics.ListCreateAPIView):
    """List and create holidays"""
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['holiday_type', 'is_recurring', 'is_observed']
    search_fields = ['name', 'description']
    ordering = ['start_date']


class HolidayDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a holiday"""
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    permission_classes = [IsAuthenticated]


# ===== ATTENDANCE SETTINGS VIEWS =====

class AttendanceSettingsView(generics.RetrieveUpdateAPIView):
    """Retrieve and update attendance settings"""
    queryset = AttendanceSettings.objects.all()
    serializer_class = AttendanceSettingsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        """Get or create settings instance"""
        settings_obj, created = AttendanceSettings.objects.get_or_create(
            pk=1,
            defaults={
                'standard_working_hours': 8.0,
                'lunch_break_duration': 1.0,
                'safe_entry_time': '08:00',
                'late_entry_time': '08:05',
                'safe_exit_time': '17:00',
                'overtime_start_time': '17:00',
                'extra_overtime_start_time': '19:00',
                'snacks_eligibility_hours': 1.0,
                'night_bill_eligibility_hours': 5.0,
                'weekend_days': [5],  # Friday
                'auto_calculate_overtime': True,
                'auto_calculate_extra_overtime': True,
                'auto_update_leave_balance': True
            }
        )
        return settings_obj


# ===== SYSTEM STATUS VIEWS =====

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_status(request):
    """Get real-time system status"""
    realtime_system = get_realtime_system()
    status_data = realtime_system.get_system_status()
    
    return Response(status_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attendance_statistics(request):
    """Get attendance statistics"""
    # Get date range
    end_date = date.today()
    start_date = end_date - timedelta(days=30)  # Last 30 days
    
    # Get statistics
    total_employees = Employee.objects.count()
    present_today = DailyAttendance.objects.filter(
        date=end_date,
        status__in=['Present-OnTime', 'Present-Considered', 'Present-Late']
    ).count()
    
    absent_today = DailyAttendance.objects.filter(
        date=end_date,
        status='Absent'
    ).count()
    
    leave_today = DailyAttendance.objects.filter(
        date=end_date,
        status__startswith='Leave-'
    ).count()
    
    # Department-wise statistics
    dept_stats = DailyAttendance.objects.filter(
        date=end_date
    ).values('employee__department__name').annotate(
        total=Count('id'),
        present=Count('id', filter=Q(status__in=['Present-OnTime', 'Present-Considered', 'Present-Late'])),
        absent=Count('id', filter=Q(status='Absent')),
        leave=Count('id', filter=Q(status__startswith='Leave-'))
    ).order_by('employee__department__name')
    
    return Response({
        'total_employees': total_employees,
        'present_today': present_today,
        'absent_today': absent_today,
        'leave_today': leave_today,
        'attendance_rate': round((present_today / total_employees * 100), 2) if total_employees > 0 else 0,
        'department_stats': list(dept_stats)
    })