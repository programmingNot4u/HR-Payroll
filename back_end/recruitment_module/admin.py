from django.contrib import admin
from .models import JobOpening, Candidate, Application


@admin.register(JobOpening)
class JobOpeningAdmin(admin.ModelAdmin):
    list_display = [
        'job_opening_id', 'title', 'designation', 'department', 
        'job_type', 'status', 'manpower', 'posted_date', 'deadline', 
        'applications_count', 'created_by', 'created_at'
    ]
    list_filter = [
        'status', 'job_type', 'department', 'designation', 
        'posted_date', 'created_at'
    ]
    search_fields = [
        'job_opening_id', 'title', 'description', 'designation__name', 
        'department__name', 'created_by__username'
    ]
    readonly_fields = ['applications_count', 'created_at', 'updated_at']
    raw_id_fields = ['designation', 'department', 'created_by']
    date_hierarchy = 'posted_date'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('job_opening_id', 'title', 'designation', 'department', 'job_type')
        }),
        ('Job Details', {
            'fields': ('description', 'requirements', 'experience_required', 'salary_range', 'manpower')
        }),
        ('Dates', {
            'fields': ('posted_date', 'deadline')
        }),
        ('Status & Tracking', {
            'fields': ('status', 'applications_count')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = [
        'candidate_id', 'name', 'email', 'phone', 'designation', 
        'department', 'job_opening', 'status', 'rating', 
        'applied_date', 'last_contact', 'created_by'
    ]
    list_filter = [
        'status', 'designation', 'department', 'applied_date', 
        'last_contact', 'created_at'
    ]
    search_fields = [
        'candidate_id', 'name', 'email', 'phone', 'designation__name', 
        'department__name', 'job_opening__title', 'created_by__username'
    ]
    readonly_fields = ['rating', 'created_at', 'updated_at']
    raw_id_fields = ['designation', 'department', 'job_opening', 'created_by']
    date_hierarchy = 'applied_date'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('candidate_id', 'name', 'email', 'phone', 'location')
        }),
        ('Job Application', {
            'fields': ('job_opening', 'designation', 'department')
        }),
        ('Professional Information', {
            'fields': ('education', 'experience', 'skills', 'skill_ratings', 'rating')
        }),
        ('Application Tracking', {
            'fields': ('status', 'applied_date', 'last_contact', 'source')
        }),
        ('Assessment', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'candidate', 'job_opening', 'status', 'applied_date', 
        'interview_date', 'created_at'
    ]
    list_filter = [
        'status', 'applied_date', 'interview_date', 'created_at'
    ]
    search_fields = [
        'candidate__name', 'candidate__email', 'job_opening__title', 
        'job_opening__job_opening_id'
    ]
    readonly_fields = ['applied_date', 'created_at', 'updated_at']
    raw_id_fields = ['candidate', 'job_opening']
    date_hierarchy = 'applied_date'
    ordering = ['-applied_date']
    
    fieldsets = (
        ('Application Details', {
            'fields': ('candidate', 'job_opening', 'status', 'applied_date')
        }),
        ('Interview Information', {
            'fields': ('interview_date', 'interview_notes')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
