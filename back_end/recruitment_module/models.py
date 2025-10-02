from django.db import models
from django.contrib.auth import get_user_model
from employees.models import Department, Designation

User = get_user_model()

class JobOpening(models.Model):
    """Model for job openings/positions"""
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('On Hold', 'On Hold'),
        ('Closed', 'Closed'),
    ]
    
    JOB_TYPE_CHOICES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
    ]
    
    # Basic Information
    job_opening_id = models.CharField(max_length=50, unique=True, help_text="Unique job opening identifier")
    title = models.CharField(max_length=200, help_text="Job title")
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE, related_name='job_openings')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='job_openings')
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='Full-time')
    
    # Job Details
    description = models.TextField(help_text="Detailed job description")
    requirements = models.JSONField(default=list, help_text="List of job requirements")
    experience_required = models.CharField(max_length=100, help_text="Required experience level")
    salary_range = models.CharField(max_length=100, help_text="Salary range for the position")
    manpower = models.PositiveIntegerField(default=1, help_text="Number of positions to fill")
    
    # Dates
    posted_date = models.DateField(help_text="Date when job was posted")
    deadline = models.DateField(help_text="Application deadline")
    
    # Status and Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    applications_count = models.PositiveIntegerField(default=0, help_text="Number of applications received")
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_job_openings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Job Opening"
        verbose_name_plural = "Job Openings"
    
    def __str__(self):
        return f"{self.job_opening_id} - {self.title}"


class Candidate(models.Model):
    """Model for job candidates/applicants"""
    
    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('Shortlisted', 'Shortlisted'),
        ('Interview Scheduled', 'Interview Scheduled'),
        ('Under Review', 'Under Review'),
        ('Available', 'Available'),
        ('Hired', 'Hired'),
        ('Did Not Qualify', 'Did Not Qualify'),
        ('Rejected', 'Rejected'),
    ]
    
    # Basic Information
    candidate_id = models.CharField(max_length=50, unique=True, help_text="Unique candidate identifier")
    name = models.CharField(max_length=200, help_text="Full name of the candidate")
    email = models.EmailField(help_text="Email address")
    phone = models.CharField(max_length=20, help_text="Phone number")
    location = models.CharField(max_length=200, help_text="Current location")
    
    # Job Application Details
    job_opening = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name='candidates')
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE, related_name='candidates')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='candidates')
    
    # Professional Information
    education = models.CharField(max_length=200, help_text="Educational background")
    experience = models.CharField(max_length=100, help_text="Work experience")
    skills = models.JSONField(default=list, help_text="List of candidate skills")
    skill_ratings = models.JSONField(default=dict, help_text="Skill ratings (1-5 scale)")
    
    # Application Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Applied')
    applied_date = models.DateField(help_text="Date when candidate applied")
    last_contact = models.DateField(help_text="Last contact date")
    source = models.CharField(max_length=100, default='Manual Entry', help_text="How candidate found the job")
    
    # Assessment
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, help_text="Overall rating (0-5)")
    notes = models.TextField(blank=True, help_text="Additional notes about the candidate")
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_candidates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Candidate"
        verbose_name_plural = "Candidates"
    
    def __str__(self):
        return f"{self.candidate_id} - {self.name}"
    
    def calculate_average_rating(self):
        """Calculate average rating from skill ratings"""
        if not self.skill_ratings:
            return 0.0
        
        ratings = [rating for rating in self.skill_ratings.values() if rating > 0]
        if not ratings:
            return 0.0
        
        return sum(ratings) / len(ratings)
    
    def save(self, *args, **kwargs):
        # Auto-calculate rating when saving
        self.rating = self.calculate_average_rating()
        super().save(*args, **kwargs)


class Application(models.Model):
    """Model for tracking job applications"""
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Under Review', 'Under Review'),
        ('Shortlisted', 'Shortlisted'),
        ('Interviewed', 'Interviewed'),
        ('Offered', 'Offered'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
        ('Withdrawn', 'Withdrawn'),
    ]
    
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    job_opening = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    applied_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, help_text="Application notes")
    
    # Interview details
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_notes = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['candidate', 'job_opening']
        ordering = ['-applied_date']
        verbose_name = "Application"
        verbose_name_plural = "Applications"
    
    def __str__(self):
        return f"{self.candidate.name} - {self.job_opening.title}"