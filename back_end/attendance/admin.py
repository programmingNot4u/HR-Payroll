from django.contrib import admin
from .models import (
    AttendanceMachine, AttendanceScan, DailyAttendance, LeavePolicy,
    LeaveBalance, LeaveRequest, Holiday, AttendanceSettings
)


@admin.register(AttendanceMachine)
class AttendanceMachineAdmin(admin.ModelAdmin):
    list_display = ['machine_id', 'name', 'machine_type', 'location', 'status', 'is_connected', 'last_sync']
    list_filter = ['machine_type', 'status', 'is_connected', 'department']
    search_fields = ['machine_id', 'name', 'location', 'ip_address']
    readonly_fields = ['created_at', 'updated_at', 'last_sync']
    ordering = ['name']


@admin.register(AttendanceScan)
class AttendanceScanAdmin(admin.ModelAdmin):
    list_display = ['employee', 'machine', 'scan_time', 'scan_type', 'is_processed']
    list_filter = ['scan_type', 'is_processed', 'machine', 'scan_time']
    search_fields = ['employee__employee_id', 'employee__user__first_name', 'employee__user__last_name']
    readonly_fields = ['id', 'created_at']
    ordering = ['-scan_time']
    date_hierarchy = 'scan_time'


@admin.register(DailyAttendance)
class DailyAttendanceAdmin(admin.ModelAdmin):
    list_display = [
        'employee', 'date', 'status', 'first_check_in', 'last_check_out',
        'total_working_hours', 'overtime_hours', 'extra_overtime_hours',
        'snacks_eligible', 'night_bill_eligible'
    ]
    list_filter = [
        'status', 'date', 'snacks_eligible', 'night_bill_eligible',
        'is_edited', 'employee__department', 'employee__level_of_work'
    ]
    search_fields = [
        'employee__employee_id', 'employee__user__first_name',
        'employee__user__last_name', 'notes'
    ]
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-date', 'employee']
    date_hierarchy = 'date'
    raw_id_fields = ['employee', 'edited_by']


@admin.register(LeavePolicy)
class LeavePolicyAdmin(admin.ModelAdmin):
    list_display = [
        'leave_type', 'max_days_per_year', 'max_carry_forward',
        'requires_approval', 'requires_medical_certificate', 'is_active'
    ]
    list_filter = ['requires_approval', 'requires_medical_certificate', 'is_active', 'gender_restriction']
    search_fields = ['leave_type', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(LeaveBalance)
class LeaveBalanceAdmin(admin.ModelAdmin):
    list_display = [
        'employee', 'leave_policy', 'year', 'total_days',
        'used_days', 'carried_forward', 'available_days'
    ]
    list_filter = ['year', 'leave_policy', 'employee__department']
    search_fields = [
        'employee__employee_id', 'employee__user__first_name',
        'employee__user__last_name'
    ]
    readonly_fields = ['available_days', 'created_at', 'updated_at']
    raw_id_fields = ['employee', 'leave_policy']


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = [
        'employee', 'leave_policy', 'start_date', 'end_date',
        'total_days', 'status', 'priority', 'requested_by'
    ]
    list_filter = [
        'status', 'priority', 'leave_policy', 'start_date',
        'employee__department'
    ]
    search_fields = [
        'employee__employee_id', 'employee__user__first_name',
        'employee__user__last_name', 'reason'
    ]
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['employee', 'leave_policy', 'requested_by', 'approved_by']
    date_hierarchy = 'start_date'


@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'holiday_type', 'start_date', 'end_date',
        'duration_days', 'is_recurring', 'is_observed'
    ]
    list_filter = ['holiday_type', 'is_recurring', 'is_observed', 'start_date']
    search_fields = ['name', 'description']
    readonly_fields = ['duration_days', 'created_at', 'updated_at']
    date_hierarchy = 'start_date'


@admin.register(AttendanceSettings)
class AttendanceSettingsAdmin(admin.ModelAdmin):
    list_display = [
        'standard_working_hours', 'lunch_break_duration',
        'safe_entry_time', 'late_entry_time', 'safe_exit_time'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    def has_add_permission(self, request):
        # Only allow one settings instance
        return not AttendanceSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of settings
        return False