from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Department, 
    Designation, 
    SalaryGrade, 
    SkillMetric, 
    ProcessExpertise, 
    Operation,
    Machine,
    Employee
)

# To improve the admin interface, we use ModelAdmin classes to customize the display.

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Department model.
    """
    list_display = ('name', 'head', 'is_active', 'employee_count')
    search_fields = ('name', 'head__full_name', 'head__username')
    list_filter = ('is_active',)
    autocomplete_fields = ('head',)
    
    def employee_count(self, obj):
        return obj.employees.count()
    employee_count.short_description = 'No. of Employees'


@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Designation model.
    """
    list_display = ('name', 'department', 'level', 'is_active')
    search_fields = ('name', 'department__name')
    list_filter = ('level', 'is_active', 'department')
    autocomplete_fields = ('department',)


@admin.register(SalaryGrade)
class SalaryGradeAdmin(admin.ModelAdmin):
    """
    Admin configuration for the SalaryGrade model.
    """
    list_display = ('name', 'grade_type', 'basic_salary', 'gross_salary', 'is_active')
    search_fields = ('name',)
    list_filter = ('grade_type', 'is_active')
    
    # Note: The gross_salary field is calculated in the model.
    # It's good practice to make it read-only if it's always auto-calculated.
    readonly_fields = ('gross_salary',)

    fieldsets = (
        (None, {
            'fields': ('name', 'grade_type', 'is_active')
        }),
        ('Salary Components', {
            'fields': ('basic_salary', 'house_rent', 'medical_allowance', 'conveyance', 'food_allowance', 'mobile_bill')
        }),
        ('Total Salary', {
            'fields': ('gross_salary',)
        }),
    )

    def save_model(self, request, obj, form, change):
        # Automatically calculate gross salary before saving
        obj.gross_salary = obj.calculate_gross_salary()
        super().save_model(request, obj, form, change)


@admin.register(SkillMetric)
class SkillMetricAdmin(admin.ModelAdmin):
    """
    Admin configuration for the SkillMetric model.
    """
    list_display = ('name', 'category', 'designation', 'department', 'is_active')
    search_fields = ('name', 'skills', 'designation', 'department')
    list_filter = ('category', 'is_active', 'designation', 'department')


@admin.register(Operation)
class OperationAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Operation model.
    """
    list_display = ('name', 'description', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'created_at')
    ordering = ('name',)


@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Machine model.
    """
    list_display = ('name', 'description', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'created_at')
    ordering = ('name',)


@admin.register(ProcessExpertise)
class ProcessExpertiseAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ProcessExpertise model.
    """
    list_display = ('operation', 'machine', 'is_active')
    search_fields = ('operation', 'machine')
    list_filter = ('is_active',)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    """
    Admin configuration for the main Employee model.
    This is highly customized for a better user experience.
    """
    list_display = ('employee_id', 'full_name', 'department', 'designation', 'mobile_number', 'status')
    search_fields = ('employee_id', 'user__full_name', 'user__email', 'mobile_number', 'nid_number')
    list_filter = ('status', 'level_of_work', 'department', 'designation')
    autocomplete_fields = ('user', 'department', 'designation', 'reporting_manager', 'salary_grade')
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25

    # Using fieldsets to group the large number of fields into logical sections
    fieldsets = (
        ('Employee Identification', {
            'fields': ('user', 'employee_id', 'picture')
        }),
        ('Organizational Information', {
            'fields': ('department', 'designation', 'level_of_work', 'status', 'reporting_manager')
        }),
        ('Personal Details', {
            'fields': (
                'name_english', 'name_bangla', 'fathers_name', 'mothers_name',
                'date_of_birth', 'gender', 'marital_status', 'spouse_name', 'religion', 
                'nationality', 'blood_group', 'height', 'weight'
            )
        }),
        ('Contact Information', {
            'fields': ('mobile_number', 'email_address', 'present_address', 'permanent_address')
        }),
        ('Official Documents', {
            'fields': ('nid_number', 'birth_certificate_number')
        }),
        ('Education & Experience', {
            'fields': ('education_level', 'subject', 'has_work_experience', 'work_experience')
        }),
        ('Joining & Administration', {
            'classes': ('collapse',), # This section will be collapsible
            'fields': (
                'date_of_joining', 'date_of_issue', 'unit', 'line',
                'supervisor_name', 'off_day'
            )
        }),
        ('Salary Information', {
            'classes': ('collapse',),
            'fields': ('salary_grade', 'gross_salary', 'salary_components')
        }),
        ('Worker-Specific Information (for "Worker" level)', {
            'classes': ('collapse',),
            'description': "These fields are primarily for employees with 'Worker' level.",
            'fields': ('process_expertise', 'process_efficiency')
        }),
        ('Family & Emergency Contacts', {
            'classes': ('collapse',),
            'fields': ('children', 'nominee', 'emergency_contact')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def full_name(self, obj):
        return obj.user.full_name
    full_name.short_description = 'Full Name'