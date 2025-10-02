from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, date, timedelta
from .models import (
    AttendanceMachine, AttendanceScan, DailyAttendance, LeavePolicy,
    LeaveBalance, LeaveRequest, Holiday, AttendanceSettings
)
from employees.models import Employee
from employees.serializers import EmployeeListSerializer


class AttendanceMachineSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    is_connected_display = serializers.CharField(source='get_is_connected_display', read_only=True)
    
    class Meta:
        model = AttendanceMachine
        fields = [
            'id', 'machine_id', 'name', 'machine_type', 'ip_address', 'port',
            'location', 'department', 'department_name', 'status', 'is_connected',
            'is_connected_display', 'last_sync', 'config', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_sync']


class AttendanceScanSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    machine_name = serializers.CharField(source='machine.name', read_only=True)
    scan_time_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceScan
        fields = [
            'id', 'employee', 'employee_id', 'employee_name', 'machine',
            'machine_name', 'scan_time', 'scan_time_formatted', 'scan_type',
            'raw_data', 'is_processed', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_scan_time_formatted(self, obj):
        return obj.scan_time.strftime('%Y-%m-%d %H:%M:%S')


class DailyAttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    department = serializers.CharField(source='employee.department.name', read_only=True)
    designation = serializers.CharField(source='employee.designation.name', read_only=True)
    level_of_work = serializers.CharField(source='employee.level_of_work', read_only=True)
    edited_by_name = serializers.CharField(source='edited_by.full_name', read_only=True)
    date_formatted = serializers.SerializerMethodField()
    first_check_in_formatted = serializers.SerializerMethodField()
    last_check_out_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = DailyAttendance
        fields = [
            'id', 'employee', 'employee_id', 'employee_name', 'department',
            'designation', 'level_of_work', 'date', 'date_formatted', 'status',
            'first_check_in', 'first_check_in_formatted', 'last_check_out',
            'last_check_out_formatted', 'total_working_hours', 'overtime_hours',
            'extra_overtime_hours', 'total_scans', 'check_in_count', 'check_out_count',
            'snacks_eligible', 'night_bill_eligible', 'notes', 'is_edited',
            'edited_by', 'edited_by_name', 'edited_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'total_working_hours',
            'overtime_hours', 'extra_overtime_hours', 'total_scans',
            'check_in_count', 'check_out_count', 'snacks_eligible',
            'night_bill_eligible'
        ]
    
    def get_date_formatted(self, obj):
        return obj.date.strftime('%Y-%m-%d')
    
    def get_first_check_in_formatted(self, obj):
        return obj.first_check_in.strftime('%H:%M') if obj.first_check_in else None
    
    def get_last_check_out_formatted(self, obj):
        return obj.last_check_out.strftime('%H:%M') if obj.last_check_out else None


class LeavePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeavePolicy
        fields = [
            'id', 'leave_type', 'max_days_per_year', 'max_carry_forward',
            'requires_approval', 'requires_medical_certificate', 'gender_restriction',
            'is_active', 'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    leave_type_name = serializers.CharField(source='leave_policy.leave_type', read_only=True)
    
    class Meta:
        model = LeaveBalance
        fields = [
            'id', 'employee', 'employee_id', 'employee_name', 'leave_policy',
            'leave_type_name', 'year', 'total_days', 'used_days', 'carried_forward',
            'available_days', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'available_days', 'created_at', 'updated_at']


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    department = serializers.CharField(source='employee.department.name', read_only=True)
    designation = serializers.CharField(source='employee.designation.name', read_only=True)
    leave_type_name = serializers.CharField(source='leave_policy.leave_type', read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.full_name', read_only=True)
    start_date_formatted = serializers.SerializerMethodField()
    end_date_formatted = serializers.SerializerMethodField()
    created_at_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_id', 'employee_name', 'department',
            'designation', 'leave_policy', 'leave_type_name', 'start_date',
            'start_date_formatted', 'end_date', 'end_date_formatted', 'total_days',
            'reason', 'status', 'priority', 'requested_by', 'requested_by_name',
            'approved_by', 'approved_by_name', 'approved_at', 'rejection_reason',
            'medical_certificate', 'other_documents', 'created_at',
            'created_at_formatted', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'approved_by', 'approved_at'
        ]
    
    def get_start_date_formatted(self, obj):
        return obj.start_date.strftime('%Y-%m-%d')
    
    def get_end_date_formatted(self, obj):
        return obj.end_date.strftime('%Y-%m-%d')
    
    def get_created_at_formatted(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
    
    def validate(self, data):
        # Validate date range
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date cannot be after end date")
        
        # Validate future dates
        today = date.today()
        if data['start_date'] < today:
            raise serializers.ValidationError("Cannot request leave for past dates")
        
        return data


class HolidaySerializer(serializers.ModelSerializer):
    duration_days = serializers.ReadOnlyField()
    start_date_formatted = serializers.SerializerMethodField()
    end_date_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Holiday
        fields = [
            'id', 'name', 'description', 'holiday_type', 'start_date',
            'start_date_formatted', 'end_date', 'end_date_formatted',
            'duration_days', 'is_recurring', 'is_observed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'duration_days', 'created_at', 'updated_at']
    
    def get_start_date_formatted(self, obj):
        return obj.start_date.strftime('%Y-%m-%d')
    
    def get_end_date_formatted(self, obj):
        return obj.end_date.strftime('%Y-%m-%d')
    
    def validate(self, data):
        # Validate date range
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date cannot be after end date")
        
        return data


class AttendanceSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSettings
        fields = [
            'id', 'standard_working_hours', 'lunch_break_duration',
            'safe_entry_time', 'late_entry_time', 'safe_exit_time',
            'overtime_start_time', 'extra_overtime_start_time',
            'snacks_eligibility_hours', 'night_bill_eligibility_hours',
            'weekend_days', 'auto_calculate_overtime', 'auto_calculate_extra_overtime',
            'auto_update_leave_balance', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttendanceSummarySerializer(serializers.Serializer):
    """Serializer for attendance summary data"""
    employee_id = serializers.CharField()
    employee_name = serializers.CharField()
    department = serializers.CharField()
    designation = serializers.CharField()
    level_of_work = serializers.CharField()
    date = serializers.DateField()
    status = serializers.CharField()
    check_in = serializers.TimeField(allow_null=True)
    check_out = serializers.TimeField(allow_null=True)
    working_hours = serializers.DecimalField(max_digits=5, decimal_places=2)
    overtime = serializers.DecimalField(max_digits=5, decimal_places=2)
    extra_overtime = serializers.DecimalField(max_digits=5, decimal_places=2)
    attendance_count = serializers.IntegerField()
    scans = serializers.ListField(child=serializers.DictField())


class TimesheetSerializer(serializers.Serializer):
    """Serializer for monthly timesheet data"""
    employee_id = serializers.CharField()
    employee_name = serializers.CharField()
    department = serializers.CharField()
    designation = serializers.CharField()
    level_of_work = serializers.CharField()
    days = serializers.ListField(child=serializers.DictField())


class LeaveBalanceSummarySerializer(serializers.Serializer):
    """Serializer for leave balance summary"""
    employee_id = serializers.CharField()
    employee_name = serializers.CharField()
    department = serializers.CharField()
    designation = serializers.CharField()
    leave_balances = serializers.DictField()


class AttendanceReportSerializer(serializers.Serializer):
    """Serializer for attendance reports"""
    report_type = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField(allow_blank=True)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    departments = serializers.ListField(child=serializers.CharField())
    employees = serializers.ListField(child=serializers.CharField())
    report_data = serializers.DictField()
    generated_by = serializers.CharField()
    generated_at = serializers.DateTimeField()

