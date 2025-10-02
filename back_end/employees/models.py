from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from authentication.models import User


class Department(models.Model):
    """
    Department model to organize employees
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    head = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='headed_departments',
        help_text="Department head/manager"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_department'
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Designation(models.Model):
    """
    Job designation/position model
    """
    LEVEL_CHOICES = [
        ('worker', 'Worker'),
        ('staff', 'Staff'),
        ('management', 'Management'),
    ]
    
    name = models.CharField(max_length=100)
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE,
        related_name='designations'
    )
    level = models.CharField(
        max_length=20, 
        choices=LEVEL_CHOICES,
        help_text="Hierarchy level of the designation"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_designation'
        verbose_name = 'Designation'
        verbose_name_plural = 'Designations'
        unique_together = ['name', 'department']
        ordering = ['department', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.department.name})"


class SalaryGrade(models.Model):
    """
    Salary Grade model for both Workers and Staff
    """
    GRADE_TYPE_CHOICES = [
        ('worker', 'Worker'),
        ('staff', 'Staff'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    grade_type = models.CharField(
        max_length=20, 
        choices=GRADE_TYPE_CHOICES,
        help_text="Worker or Staff grade"
    )
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    house_rent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    medical_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    conveyance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    food_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    mobile_bill = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_salary_grade'
        verbose_name = 'Salary Grade'
        verbose_name_plural = 'Salary Grades'
        ordering = ['grade_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_grade_type_display()})"
    
    def calculate_gross_salary(self):
        """Calculate gross salary from components"""
        return (
            self.basic_salary + 
            self.house_rent + 
            self.medical_allowance + 
            self.conveyance + 
            self.food_allowance + 
            self.mobile_bill
        )


class SkillMetric(models.Model):
    """
    Skill Metrics model
    """
    CATEGORY_CHOICES = [
        ('technical', 'Technical'),
        ('soft_skills', 'Soft Skills'),
        ('management', 'Management'),
        ('cognitive', 'Cognitive'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        help_text="Skill category"
    )
    designation = models.CharField(max_length=200, blank=True, null=True, help_text="Designation for technical skills")
    department = models.CharField(max_length=200, blank=True, null=True, help_text="Department for technical skills")
    skills = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of skills: ['skill1', 'skill2', ...]"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_skill_metric'
        verbose_name = 'Skill Metric'
        verbose_name_plural = 'Skill Metrics'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Operation(models.Model):
    """
    Operation model for process expertise
    """
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_operation'
        verbose_name = 'Operation'
        verbose_name_plural = 'Operations'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Machine(models.Model):
    """
    Machine model for process expertise
    """
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_machine'
        verbose_name = 'Machine'
        verbose_name_plural = 'Machines'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ProcessExpertise(models.Model):
    """
    Process Expertise model - now used for employee-specific expertise
    """
    operation = models.CharField(max_length=200, blank=True, null=True)
    machine = models.CharField(max_length=200, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_process_expertise'
        verbose_name = 'Process Expertise'
        verbose_name_plural = 'Process Expertises'
        # Removed unique_together constraint to allow separate operations and machines
        ordering = ['operation', 'machine']
    
    def __str__(self):
        if self.operation and self.machine:
            return f"{self.operation} - {self.machine}"
        elif self.operation:
            return self.operation
        elif self.machine:
            return self.machine
        else:
            return "Process Expertise"


class Employee(models.Model):
    """
    Main Employee model - Completely rewritten to match frontend exactly
    """
    # Employee Type Choices
    EMPLOYEE_TYPE_CHOICES = [
        ('worker', 'Worker'),
        ('staff', 'Staff'),
    ]
    
    # Gender Choices
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    # Status Choices
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('terminated', 'Terminated'),
        ('on_leave', 'On Leave'),
    ]
    
    # Blood Group Choices (exactly as frontend)
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]
    
    # Marital Status Choices (exactly as frontend)
    MARITAL_STATUS_CHOICES = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
    ]
    
    # Education Level Choices (exactly as frontend)
    EDUCATION_LEVEL_CHOICES = [
        ('Alphabetic Knowledge', 'Alphabetic Knowledge'),
        ('JSC or Equivalent', 'JSC or Equivalent'),
        ('SSC or Equivalent', 'SSC or Equivalent'),
        ('HSC or Equivalent', 'HSC or Equivalent'),
        ('Hon\'s', 'Hon\'s'),
        ('Master\'s', 'Master\'s'),
        ('BSc', 'BSc'),
        ('MSc', 'MSc'),
        ('PhD', 'PhD'),
    ]
    
    # Off Day Choices (exactly as frontend)
    OFF_DAY_CHOICES = [
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
    ]
    
    # One-to-one relationship with User
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='employee_profile'
    )
    
    # ===== EMPLOYEE IDENTIFICATION =====
    employee_id = models.CharField(
        max_length=20, 
        unique=True,
        blank=True,
        help_text="Unique employee identifier (e.g., EMP001) - auto-generated"
    )
    
    # ===== ORGANIZATIONAL INFORMATION =====
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE,
        related_name='employees'
    )
    designation = models.ForeignKey(
        Designation, 
        on_delete=models.CASCADE,
        related_name='employees'
    )
    level_of_work = models.CharField(
        max_length=20, 
        choices=EMPLOYEE_TYPE_CHOICES,
        help_text="Worker or Staff"
    )
    
    # ===== PERSONAL INFORMATION =====
    # Employee Picture
    picture = models.ImageField(
        upload_to='employee_photos/', 
        null=True, 
        blank=True,
        help_text="JPG, PNG or GIF up to 5MB"
    )
    
    # Names
    name_bangla = models.CharField(
        max_length=200, 
        blank=True,
        help_text="Name in Bangla"
    )
    name_english = models.CharField(
        max_length=200, 
        blank=True,
        help_text="Name in English"
    )
    
    # Contact Information
    mobile_number = models.CharField(
        max_length=20, 
        blank=True,
        help_text="Mobile number with country code"
    )
    email_address = models.EmailField(
        blank=True,
        help_text="Email address"
    )
    
    # Personal Details
    nationality = models.CharField(
        max_length=100, 
        default='Bangladeshi'
    )
    fathers_name = models.CharField(
        max_length=200, 
        blank=True
    )
    mothers_name = models.CharField(
        max_length=200, 
        blank=True
    )
    spouse_name = models.CharField(
        max_length=200, 
        blank=True,
        help_text="Husband/Wife's Name"
    )
    date_of_birth = models.DateField(
        null=True, 
        blank=True
    )
    nid_number = models.CharField(
        max_length=20, 
        blank=True,
        help_text="National ID Number"
    )
    birth_certificate_number = models.CharField(
        max_length=20, 
        blank=True
    )
    blood_group = models.CharField(
        max_length=5, 
        choices=BLOOD_GROUP_CHOICES, 
        blank=True
    )
    religion = models.CharField(
        max_length=50, 
        default='Islam'
    )
    marital_status = models.CharField(
        max_length=20, 
        choices=MARITAL_STATUS_CHOICES, 
        blank=True
    )
    height = models.CharField(
        max_length=10, 
        blank=True,
        help_text="Height in cm"
    )
    weight = models.CharField(
        max_length=10, 
        blank=True,
        help_text="Weight in kg"
    )
    education_level = models.CharField(
        max_length=50, 
        choices=EDUCATION_LEVEL_CHOICES, 
        blank=True,
        help_text="Last Educational Status"
    )
    subject = models.CharField(
        max_length=200, 
        blank=True,
        help_text="Subject/Field of study"
    )
    gender = models.CharField(
        max_length=10, 
        choices=GENDER_CHOICES,
        blank=True
    )
    
    # ===== CHILDREN INFORMATION (JSON) =====
    children = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of children information: [{'name': '', 'age': '', 'education': '', 'institute': ''}]"
    )
    
    # ===== ADDRESS INFORMATION (JSON) =====
    present_address = models.JSONField(
        default=dict,
        blank=True,
        help_text="Present address: {'houseOwnerName': '', 'village': '', 'postOffice': '', 'upazilla': '', 'district': ''}"
    )
    permanent_address = models.JSONField(
        default=dict,
        blank=True,
        help_text="Permanent address: {'houseOwnerName': '', 'village': '', 'postOffice': '', 'upazilla': '', 'district': ''}"
    )
    
    # ===== WORK EXPERIENCE (JSON) =====
    has_work_experience = models.BooleanField(
        default=False,
        help_text="Do you have work experience?"
    )
    work_experience = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of work experience: [{'companyName': '', 'department': '', 'designation': '', 'salary': '', 'duration': ''}]"
    )
    
    # ===== PROCESS EXPERTISE (JSON - for Workers only) =====
    process_expertise = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of process expertise: [{'operation': '', 'machine': '', 'duration': ''}]"
    )
    
    # ===== PROCESS EFFICIENCY (JSON - for Workers only) =====
    process_efficiency = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of process efficiency: [{'itemDescription': '', 'processDeliveryPerHour': '', 'remarks': ''}]"
    )
    
    # ===== NOMINEE INFORMATION (JSON) =====
    nominee = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of nominees: [{'name': '', 'mobile': '', 'nidBirthCertificate': ''}]"
    )
    
    # ===== EMERGENCY CONTACT (JSON) =====
    emergency_contact = models.JSONField(
        default=dict,
        blank=True,
        help_text="Emergency contact: {'name': '', 'mobile': '', 'relation': ''}"
    )
    
    # ===== ADMINISTRATION SECTION =====
    off_day = models.CharField(
        max_length=20, 
        choices=OFF_DAY_CHOICES, 
        blank=True
    )
    unit = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Unit (free text field)"
    )
    line = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Line 1, Line 2, etc."
    )
    supervisor_name = models.CharField(
        max_length=200, 
        blank=True,
        help_text="Supervisor's Name"
    )
    salary_grade = models.ForeignKey(
        SalaryGrade,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Worker/Staff Salary Grade"
    )
    gross_salary = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Gross Salary"
    )
    date_of_joining = models.DateField(
        null=True, 
        blank=True,
        help_text="Date of Joining"
    )
    date_of_issue = models.DateField(
        null=True, 
        blank=True,
        help_text="Date of Issue"
    )
    
    # ===== SALARY COMPONENTS (JSON) =====
    salary_components = models.JSONField(
        default=dict,
        blank=True,
        help_text="Salary components: {'basicSalary': {'enabled': true, 'amount': 0, 'custom': false}, 'houseRent': {...}, 'medicalAllowance': {...}, 'foodAllowance': {...}, 'conveyance': {...}, 'mobileBill': {...}}"
    )
    
    # ===== EMPLOYMENT STATUS =====
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='active'
    )
    
    # ===== REPORTING STRUCTURE =====
    reporting_manager = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='subordinates',
        help_text="Direct reporting manager"
    )
    
    # ===== GENERATED CREDENTIALS =====
    generated_email = models.EmailField(
        blank=True,
        null=True,
        help_text="Generated email for login credentials"
    )
    generated_password = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Generated password for login credentials"
    )
    
    # ===== TIMESTAMPS =====
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees_employee'
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'
        ordering = ['employee_id']
    
    def __str__(self):
        return f"{self.employee_id} - {self.user.full_name}"
    
    @property
    def full_name(self):
        return self.user.full_name
    
    @property
    def email(self):
        return self.user.email
    
    @property
    def phone(self):
        return self.user.phone
    
    def get_department_name(self):
        return self.department.name
    
    def get_designation_name(self):
        return self.designation.name
    
    def is_active(self):
        return self.status == 'active'
    
    def get_employee_type_display(self):
        return dict(self.EMPLOYEE_TYPE_CHOICES).get(self.level_of_work, self.level_of_work)
    
    def get_total_salary_components(self):
        """Calculate total from salary components"""
        if not self.salary_components:
            return 0
        
        total = 0
        for component, data in self.salary_components.items():
            if isinstance(data, dict) and data.get('enabled', False):
                total += data.get('amount', 0)
        return total
    
    def save(self, *args, **kwargs):
        """
        Override save to auto-generate user credentials when creating new employee
        Only generate if no email is already set (manual email provided)
        """
        is_new = self.pk is None
        
        if is_new:
            # Only generate email and password if user doesn't already have an email
            # This allows manual emails to be preserved
            if not self.user.email or self.user.email == '':
                # Generate email and password for new employee
                email, password = User.generate_employee_credentials(self.employee_id, self.user.phone)
                self.user.email = email
                self.user.set_password(password)
                self.user.save()
        
        super().save(*args, **kwargs)