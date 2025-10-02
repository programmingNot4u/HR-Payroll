from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from employees.models import Employee, Department
from authentication.models import User
import uuid


class AttendanceMachine(models.Model):
    """
    Model to store fingerprint machine information
    """
    MACHINE_TYPE_CHOICES = [
        ('simulated', 'Simulated'),
        ('zkteco', 'ZKTeco'),
        ('suprema', 'Suprema'),
        ('hikvision', 'Hikvision'),
        ('generic', 'Generic'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
        ('error', 'Error'),
    ]
    
    machine_id = models.CharField(max_length=50, unique=True, help_text="Unique machine identifier")
    name = models.CharField(max_length=200, help_text="Machine name/location")
    machine_type = models.CharField(max_length=20, choices=MACHINE_TYPE_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    port = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True, help_text="Physical location")
    department = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Department this machine serves"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_connected = models.BooleanField(default=False)
    last_sync = models.DateTimeField(null=True, blank=True)
    config = models.JSONField(default=dict, blank=True, help_text="Machine-specific configuration")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_machine'
        verbose_name = 'Attendance Machine'
        verbose_name_plural = 'Attendance Machines'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.machine_type})"


class AttendanceScan(models.Model):
    """
    Model to store individual attendance scans from machines
    """
    SCAN_TYPE_CHOICES = [
        ('IN', 'Check In'),
        ('OUT', 'Check Out'),
        ('BREAK_IN', 'Break In'),
        ('BREAK_OUT', 'Break Out'),
        ('OVERTIME_IN', 'Overtime In'),
        ('OVERTIME_OUT', 'Overtime Out'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE,
        related_name='attendance_scans'
    )
    machine = models.ForeignKey(
        AttendanceMachine,
        on_delete=models.CASCADE,
        related_name='scans'
    )
    scan_time = models.DateTimeField(help_text="Exact time of scan")
    scan_type = models.CharField(max_length=20, choices=SCAN_TYPE_CHOICES)
    raw_data = models.JSONField(default=dict, blank=True, help_text="Raw machine data")
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'attendance_scan'
        verbose_name = 'Attendance Scan'
        verbose_name_plural = 'Attendance Scans'
        ordering = ['-scan_time']
        indexes = [
            models.Index(fields=['employee', 'scan_time']),
            models.Index(fields=['machine', 'scan_time']),
            models.Index(fields=['scan_time']),
        ]
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.scan_type} at {self.scan_time}"


class DailyAttendance(models.Model):
    """
    Model to store daily attendance summary for each employee
    """
    STATUS_CHOICES = [
        ('Present-OnTime', 'Present On Time'),
        ('Present-Considered', 'Present Considered'),
        ('Present-Late', 'Present Late'),
        ('Absent', 'Absent'),
        ('Leave-Earn', 'Leave Earn'),
        ('Leave-Casual', 'Leave Casual'),
        ('Leave-Sick', 'Leave Sick'),
        ('Leave-Maternity', 'Leave Maternity'),
        ('Leave-WithOutPay', 'Leave Without Pay'),
        ('Holiday', 'Holiday'),
        ('Weekend', 'Weekend'),
    ]
    
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='daily_attendance'
    )
    date = models.DateField(help_text="Attendance date")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Absent')
    
    # Check-in/out times
    first_check_in = models.TimeField(null=True, blank=True)
    last_check_out = models.TimeField(null=True, blank=True)
    
    # Working hours calculations
    total_working_hours = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(24)]
    )
    overtime_hours = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(16)]
    )
    extra_overtime_hours = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(16)]
    )
    
    # Scan counts
    total_scans = models.PositiveIntegerField(default=0)
    check_in_count = models.PositiveIntegerField(default=0)
    check_out_count = models.PositiveIntegerField(default=0)
    
    # Eligibility flags (for workers)
    snacks_eligible = models.BooleanField(default=False)
    night_bill_eligible = models.BooleanField(default=False)
    
    # Additional data
    notes = models.TextField(blank=True)
    is_edited = models.BooleanField(default=False)
    edited_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='edited_attendance'
    )
    edited_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_daily'
        verbose_name = 'Daily Attendance'
        verbose_name_plural = 'Daily Attendance Records'
        unique_together = ['employee', 'date']
        ordering = ['-date', 'employee']
        indexes = [
            models.Index(fields=['employee', 'date']),
            models.Index(fields=['date', 'status']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"
    
    def calculate_working_hours(self):
        """Calculate working hours based on check-in/out times"""
        if not self.first_check_in or not self.last_check_out:
            return 0
        
        # Convert times to minutes for calculation
        check_in_minutes = self.first_check_in.hour * 60 + self.first_check_in.minute
        check_out_minutes = self.last_check_out.hour * 60 + self.last_check_out.minute
        
        # Handle overnight shifts (check-out next day)
        if check_out_minutes < check_in_minutes:
            check_out_minutes += 24 * 60
        
        # Calculate total minutes worked
        total_minutes = check_out_minutes - check_in_minutes
        
        # Subtract lunch break (1 hour = 60 minutes)
        total_minutes -= 60
        
        # Convert to hours
        working_hours = max(0, total_minutes / 60)
        return round(working_hours, 2)
    
    def calculate_overtime(self):
        """Calculate overtime hours for workers"""
        if self.employee.level_of_work != 'worker':
            return 0
        
        if not self.last_check_out:
            return 0
        
        # Overtime starts after 5:00 PM (17:00)
        overtime_start_minutes = 17 * 60  # 5:00 PM
        check_out_minutes = self.last_check_out.hour * 60 + self.last_check_out.minute
        
        # Handle overnight shifts
        if check_out_minutes < overtime_start_minutes:
            check_out_minutes += 24 * 60
            overtime_start_minutes += 24 * 60
        
        if check_out_minutes > overtime_start_minutes:
            overtime_minutes = min(check_out_minutes - overtime_start_minutes, 2 * 60)  # Max 2 hours
            return round(overtime_minutes / 60, 2)
        
        return 0
    
    def calculate_extra_overtime(self):
        """Calculate extra overtime hours for workers (after 7:00 PM)"""
        if self.employee.level_of_work != 'worker':
            return 0
        
        if not self.last_check_out:
            return 0
        
        # Extra overtime starts after 7:00 PM (19:00)
        extra_overtime_start_minutes = 19 * 60  # 7:00 PM
        check_out_minutes = self.last_check_out.hour * 60 + self.last_check_out.minute
        
        # Handle overnight shifts
        if check_out_minutes < extra_overtime_start_minutes:
            check_out_minutes += 24 * 60
            extra_overtime_start_minutes += 24 * 60
        
        if check_out_minutes > extra_overtime_start_minutes:
            extra_overtime_minutes = check_out_minutes - extra_overtime_start_minutes
            return round(extra_overtime_minutes / 60, 2)
        
        return 0


class LeavePolicy(models.Model):
    """
    Model to store company leave policies
    """
    LEAVE_TYPE_CHOICES = [
        ('casual', 'Casual Leave'),
        ('sick', 'Sick Leave'),
        ('annual', 'Annual Leave'),
        ('maternity', 'Maternity Leave'),
        ('paternity', 'Paternity Leave'),
        ('earned', 'Earned Leave'),
        ('compensatory', 'Compensatory Leave'),
        ('without_pay', 'Leave Without Pay'),
    ]
    
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES, unique=True)
    max_days_per_year = models.PositiveIntegerField(help_text="Maximum days allowed per year")
    max_carry_forward = models.PositiveIntegerField(default=0, help_text="Maximum days that can be carried forward")
    requires_approval = models.BooleanField(default=True)
    requires_medical_certificate = models.BooleanField(default=False)
    gender_restriction = models.CharField(
        max_length=10,
        choices=[('all', 'All'), ('male', 'Male'), ('female', 'Female')],
        default='all'
    )
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_leave_policy'
        verbose_name = 'Leave Policy'
        verbose_name_plural = 'Leave Policies'
        ordering = ['leave_type']
    
    def __str__(self):
        return f"{self.get_leave_type_display()} - {self.max_days_per_year} days"


class LeaveBalance(models.Model):
    """
    Model to store employee leave balances
    """
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='leave_balances'
    )
    leave_policy = models.ForeignKey(
        LeavePolicy,
        on_delete=models.CASCADE,
        related_name='balances'
    )
    year = models.PositiveIntegerField(help_text="Year for this balance")
    total_days = models.PositiveIntegerField(help_text="Total days allocated for this year")
    used_days = models.PositiveIntegerField(default=0, help_text="Days used this year")
    carried_forward = models.PositiveIntegerField(default=0, help_text="Days carried forward from previous year")
    available_days = models.PositiveIntegerField(help_text="Available days (calculated)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_leave_balance'
        verbose_name = 'Leave Balance'
        verbose_name_plural = 'Leave Balances'
        unique_together = ['employee', 'leave_policy', 'year']
        ordering = ['employee', 'leave_policy', 'year']
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.leave_policy.leave_type} - {self.year}"
    
    def save(self, *args, **kwargs):
        # Calculate available days
        self.available_days = self.total_days + self.carried_forward - self.used_days
        super().save(*args, **kwargs)


class LeaveRequest(models.Model):
    """
    Model to store employee leave requests
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='leave_requests'
    )
    leave_policy = models.ForeignKey(
        LeavePolicy,
        on_delete=models.CASCADE,
        related_name='requests'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    total_days = models.PositiveIntegerField(help_text="Total days requested")
    reason = models.TextField(help_text="Reason for leave")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Approval workflow
    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='requested_leaves'
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_leaves'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Supporting documents
    medical_certificate = models.FileField(
        upload_to='leave_documents/',
        null=True,
        blank=True
    )
    other_documents = models.JSONField(
        default=list,
        blank=True,
        help_text="List of additional document URLs"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_leave_request'
        verbose_name = 'Leave Request'
        verbose_name_plural = 'Leave Requests'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employee', 'start_date']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.leave_policy.leave_type} - {self.start_date} to {self.end_date}"


class Holiday(models.Model):
    """
    Model to store company holidays
    """
    HOLIDAY_TYPE_CHOICES = [
        ('national', 'National Holiday'),
        ('religious', 'Religious Holiday'),
        ('cultural', 'Cultural Holiday'),
        ('company', 'Company Holiday'),
    ]
    
    name = models.CharField(max_length=200, help_text="Holiday name")
    description = models.TextField(blank=True)
    holiday_type = models.CharField(max_length=20, choices=HOLIDAY_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    is_recurring = models.BooleanField(default=False, help_text="Recurring annually")
    is_observed = models.BooleanField(default=True, help_text="Is this holiday observed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_holiday'
        verbose_name = 'Holiday'
        verbose_name_plural = 'Holidays'
        ordering = ['start_date']
        indexes = [
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['holiday_type']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.start_date}"
    
    @property
    def duration_days(self):
        """Calculate duration in days"""
        return (self.end_date - self.start_date).days + 1


class AttendanceSettings(models.Model):
    """
    Model to store attendance system settings
    """
    # Working hours
    standard_working_hours = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=8.0,
        help_text="Standard working hours per day"
    )
    lunch_break_duration = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.0,
        help_text="Lunch break duration in hours"
    )
    
    # Check-in/out times
    safe_entry_time = models.TimeField(default='08:00', help_text="Safe entry time")
    late_entry_time = models.TimeField(default='08:05', help_text="Late entry time")
    safe_exit_time = models.TimeField(default='17:00', help_text="Safe exit time")
    
    # Overtime settings
    overtime_start_time = models.TimeField(default='17:00', help_text="Overtime start time")
    extra_overtime_start_time = models.TimeField(default='19:00', help_text="Extra overtime start time")
    
    # Eligibility settings
    snacks_eligibility_hours = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.0,
        help_text="Extra overtime hours required for snacks eligibility"
    )
    night_bill_eligibility_hours = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=5.0,
        help_text="Extra overtime hours required for night bill eligibility"
    )
    
    # Weekend settings
    weekend_days = models.JSONField(
        default=list,
        help_text="List of weekend days (0=Sunday, 1=Monday, etc.)"
    )
    
    # Auto-calculation settings
    auto_calculate_overtime = models.BooleanField(default=True)
    auto_calculate_extra_overtime = models.BooleanField(default=True)
    auto_update_leave_balance = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_settings'
        verbose_name = 'Attendance Settings'
        verbose_name_plural = 'Attendance Settings'
    
    def __str__(self):
        return "Attendance Settings"
    
    def save(self, *args, **kwargs):
        # Ensure only one settings instance
        if not self.pk and AttendanceSettings.objects.exists():
            raise ValueError("Only one AttendanceSettings instance is allowed")
        super().save(*args, **kwargs)