from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from authentication.models import User
from employees.models import Employee, Department, Designation


class EmployeeKPI(models.Model):
    """
    Model for employee KPI ratings and skill assessments
    """
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='kpi_ratings',
        help_text="Employee being rated"
    )
    
    # Skill ratings stored as JSON
    skill_ratings = models.JSONField(
        default=dict,
        blank=True,
        help_text="Dictionary of skill ratings: {'skill_name': rating_value}"
    )
    
    # Overall KPI score (calculated from skill ratings)
    overall_score = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        help_text="Overall KPI score (0.0-5.0)"
    )
    
    # Assessment period
    assessment_year = models.PositiveIntegerField(
        help_text="Year of assessment"
    )
    assessment_month = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 13)],
        help_text="Month of assessment"
    )
    
    # Assessment details
    assessed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assessed_kpis',
        help_text="User who performed the assessment"
    )
    
    # Notes and comments
    notes = models.TextField(
        blank=True,
        help_text="Additional notes about the assessment"
    )
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'kpi_employee_kpi'
        verbose_name = 'Employee KPI'
        verbose_name_plural = 'Employee KPIs'
        ordering = ['-created_at']
        unique_together = ['employee', 'assessment_year', 'assessment_month']
    
    def __str__(self):
        return f"{self.employee.full_name} - {self.assessment_year}-{self.assessment_month:02d}"
    
    def calculate_overall_score(self):
        """Calculate overall score from skill ratings"""
        if not self.skill_ratings:
            return 0.0
        
        ratings = [rating for rating in self.skill_ratings.values() if rating > 0]
        if not ratings:
            return 0.0
        
        return round(sum(ratings) / len(ratings), 1)
    
    def save(self, *args, **kwargs):
        """Override save to calculate overall score"""
        self.overall_score = self.calculate_overall_score()
        super().save(*args, **kwargs)


class KPITemplate(models.Model):
    """
    Template for KPI assessments by designation and department
    """
    name = models.CharField(
        max_length=200,
        help_text="Template name"
    )
    description = models.TextField(
        blank=True,
        help_text="Template description"
    )
    
    # Template scope
    designation = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Specific designation (null for all)"
    )
    department = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Specific department (null for all)"
    )
    
    # Skills configuration
    soft_skills = models.JSONField(
        default=list,
        blank=True,
        help_text="List of soft skills for this template"
    )
    technical_skills = models.JSONField(
        default=list,
        blank=True,
        help_text="List of technical skills for this template"
    )
    
    # Template settings
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this template is currently active"
    )
    
    # Audit fields
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_kpi_templates',
        help_text="User who created this template"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'kpi_template'
        verbose_name = 'KPI Template'
        verbose_name_plural = 'KPI Templates'
        ordering = ['name']
    
    def __str__(self):
        scope = f" - {self.designation}" if self.designation else ""
        scope += f" ({self.department})" if self.department else ""
        return f"{self.name}{scope}"


class KPIAssessmentHistory(models.Model):
    """
    History of KPI assessment changes
    """
    kpi = models.ForeignKey(
        EmployeeKPI,
        on_delete=models.CASCADE,
        related_name='history',
        help_text="Related KPI assessment"
    )
    action = models.CharField(
        max_length=50,
        help_text="Action performed (created, updated, deleted, etc.)"
    )
    old_value = models.TextField(
        blank=True,
        help_text="Previous value"
    )
    new_value = models.TextField(
        blank=True,
        help_text="New value"
    )
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="User who made the change"
    )
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(
        blank=True,
        help_text="Additional notes about the change"
    )
    
    class Meta:
        db_table = 'kpi_assessment_history'
        verbose_name = 'KPI Assessment History'
        verbose_name_plural = 'KPI Assessment Histories'
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.kpi.employee.name} - {self.action}"