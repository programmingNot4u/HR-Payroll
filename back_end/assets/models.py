from django.db import models
from django.contrib.auth import get_user_model
from employees.models import Employee

User = get_user_model()

class Asset(models.Model):
    """Main Asset model for tracking company assets"""
    
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Assigned', 'Assigned'),
        ('Maintenance', 'Maintenance'),
        ('Damaged', 'Damaged'),
        ('Lost', 'Lost'),
        ('Retired', 'Retired'),
    ]
    
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Office Equipment', 'Office Equipment'),
        ('Furniture', 'Furniture'),
        ('HVAC', 'HVAC'),
        ('Security', 'Security'),
        ('Machinery', 'Machinery'),
        ('Vehicles', 'Vehicles'),
    ]
    
    # Basic Asset Information
    id = models.CharField(max_length=50, primary_key=True, help_text="Unique Asset ID")
    name = models.CharField(max_length=200, help_text="Asset Name")
    model = models.CharField(max_length=100, blank=True, null=True, help_text="Asset Model")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, help_text="Asset Category")
    department = models.CharField(max_length=100, help_text="Department")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available', help_text="Current Status")
    
    # Value
    value = models.DecimalField(max_digits=12, decimal_places=2, help_text="Purchase Value")
    
    # Purchase Information
    purchase_date = models.DateField(blank=True, null=True, help_text="Purchase Date")
    depreciation_rate = models.PositiveIntegerField(default=20, help_text="Annual Depreciation Rate (%)")
    vendor = models.CharField(max_length=200, blank=True, null=True, help_text="Vendor Name")
    acc_voucher = models.CharField(max_length=100, blank=True, null=True, help_text="Accounting Voucher")
    warranty_period = models.CharField(max_length=100, blank=True, null=True, help_text="Warranty Period")
    
    # Assignment Information (current assignment)
    assigned_to = models.CharField(max_length=200, default='Unassigned', help_text="Currently Assigned To")
    assigned_to_id = models.CharField(max_length=50, blank=True, null=True, help_text="Assigned Employee ID")
    assignment_date = models.DateField(blank=True, null=True, help_text="Assignment Date")
    expected_return_date = models.DateField(blank=True, null=True, help_text="Expected Return Date")
    assignment_reason = models.TextField(blank=True, null=True, help_text="Assignment Reason")
    assigned_by = models.CharField(max_length=200, blank=True, null=True, help_text="Assigned By")
    assignment_notes = models.TextField(blank=True, null=True, help_text="Assignment Notes")
    assigned_condition = models.CharField(max_length=50, default='Good', help_text="Assigned Condition")
    
    # Return Information
    return_date = models.DateField(blank=True, null=True, help_text="Return Date")
    return_condition = models.CharField(max_length=50, blank=True, null=True, help_text="Return Condition")
    return_reason = models.TextField(blank=True, null=True, help_text="Return Reason")
    returned_by = models.CharField(max_length=200, blank=True, null=True, help_text="Returned By")
    return_notes = models.TextField(blank=True, null=True, help_text="Return Notes")
    return_processed_date = models.DateField(blank=True, null=True, help_text="Return Processed Date")
    
    # Maintenance Information
    need_maintenance = models.BooleanField(default=False, help_text="Asset needs maintenance")
    
    # Disposal Information
    disposal_date = models.DateField(blank=True, null=True, help_text="Disposal Date")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['id']
        verbose_name = 'Asset'
        verbose_name_plural = 'Assets'
    
    def __str__(self):
        return f"{self.id} - {self.name}"
    
    @property
    def is_assigned(self):
        """Check if asset is currently assigned"""
        return self.status == 'Assigned' and self.assigned_to != 'Unassigned'


class AssetAssignment(models.Model):
    """Track asset assignment history"""
    
    CONDITION_CHOICES = [
        ('Good', 'Good'),
        ('Need Maintenance', 'Need Maintenance'),
        ('Lost', 'Lost'),
    ]
    
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='assignment_history')
    employee_id = models.CharField(max_length=50, help_text="Employee ID")
    employee_name = models.CharField(max_length=200, help_text="Employee Name")
    assignment_date = models.DateField(help_text="Assignment Date")
    expected_return_date = models.DateField(blank=True, null=True, help_text="Expected Return Date")
    assignment_reason = models.TextField(blank=True, null=True, help_text="Assignment Reason")
    assigned_by = models.CharField(max_length=200, blank=True, null=True, help_text="Assigned By")
    assigned_condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, default='Good', help_text="Assigned Condition")
    assignment_notes = models.TextField(blank=True, null=True, help_text="Assignment Notes")
    
    # Return information
    return_date = models.DateField(blank=True, null=True, help_text="Return Date")
    return_condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, blank=True, null=True, help_text="Return Condition")
    return_reason = models.TextField(blank=True, null=True, help_text="Return Reason")
    returned_by = models.CharField(max_length=200, blank=True, null=True, help_text="Returned By")
    return_notes = models.TextField(blank=True, null=True, help_text="Return Notes")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-assignment_date']
        verbose_name = 'Asset Assignment'
        verbose_name_plural = 'Asset Assignments'
    
    def __str__(self):
        return f"{self.asset.name} - {self.employee_name} ({self.assignment_date})"
    
    @property
    def is_active(self):
        """Check if assignment is currently active"""
        return self.return_date is None


class AssetMaintenance(models.Model):
    """Track asset maintenance records"""
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Ongoing', 'Ongoing'),
        ('Complete', 'Complete'),
    ]
    
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='maintenance_history')
    scheduled_date = models.DateField(help_text="Scheduled Date")
    completed_date = models.DateField(blank=True, null=True, help_text="Completed Date")
    maintenance_provider = models.CharField(max_length=200, help_text="Maintenance Provider")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending', help_text="Status")
    description = models.TextField(blank=True, null=True, help_text="Description")
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Maintenance Cost")
    notes = models.TextField(blank=True, null=True, help_text="Notes")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_date']
        verbose_name = 'Asset Maintenance'
        verbose_name_plural = 'Asset Maintenance Records'
    
    def __str__(self):
        return f"{self.asset.name} - {self.maintenance_provider} ({self.scheduled_date})"
    
    @property
    def is_completed(self):
        """Check if maintenance is completed"""
        return self.status == 'Complete' and self.completed_date is not None


class AssetReturn(models.Model):
    """Track asset return history"""
    
    CONDITION_CHOICES = [
        ('Good', 'Good'),
        ('Need Maintenance', 'Need Maintenance'),
        ('Lost', 'Lost'),
    ]
    
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='return_history')
    employee_id = models.CharField(max_length=50, help_text="Employee ID")
    employee_name = models.CharField(max_length=200, help_text="Employee Name")
    assigned_date = models.DateField(help_text="Original Assignment Date")
    return_date = models.DateField(help_text="Return Date")
    return_condition = models.CharField(max_length=50, choices=CONDITION_CHOICES, help_text="Return Condition")
    return_reason = models.TextField(blank=True, null=True, help_text="Return Reason")
    received_by = models.CharField(max_length=200, help_text="Received By")
    return_notes = models.TextField(blank=True, null=True, help_text="Return Notes")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-return_date']
        verbose_name = 'Asset Return'
        verbose_name_plural = 'Asset Returns'
    
    def __str__(self):
        return f"{self.asset.name} - {self.employee_name} ({self.return_date})"
    
    @property
    def duration(self):
        """Calculate duration between assignment and return"""
        if self.assigned_date and self.return_date:
            delta = self.return_date - self.assigned_date
            days = delta.days
            
            if days == 0:
                return 'Same day'
            elif days == 1:
                return '1 day'
            elif days < 30:
                return f'{days} days'
            elif days < 365:
                months = days // 30
                remaining_days = days % 30
                if remaining_days > 0:
                    return f'{months} month{"s" if months > 1 else ""} {remaining_days} day{"s" if remaining_days > 1 else ""}'
                else:
                    return f'{months} month{"s" if months > 1 else ""}'
            else:
                years = days // 365
                remaining_days = days % 365
                months = remaining_days // 30
                if months > 0:
                    return f'{years} year{"s" if years > 1 else ""} {months} month{"s" if months > 1 else ""}'
                else:
                    return f'{years} year{"s" if years > 1 else ""}'
        return 'N/A'