from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import JobOpening, Candidate, Application
from employees.models import Department, Designation

User = get_user_model()


class JobOpeningSerializer(serializers.ModelSerializer):
    """Serializer for Job Opening model"""
    
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = JobOpening
        fields = [
            'id',
            'job_opening_id',
            'title',
            'designation',
            'designation_name',
            'department',
            'department_name',
            'job_type',
            'description',
            'requirements',
            'experience_required',
            'salary_range',
            'manpower',
            'posted_date',
            'deadline',
            'status',
            'applications_count',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'applications_count']


class JobOpeningListSerializer(serializers.ModelSerializer):
    """Simplified serializer for job opening lists"""
    
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = JobOpening
        fields = [
            'id',
            'job_opening_id',
            'title',
            'designation_name',
            'department_name',
            'job_type',
            'experience_required',
            'salary_range',
            'manpower',
            'posted_date',
            'deadline',
            'status',
            'applications_count',
            'created_at'
        ]


class CandidateSerializer(serializers.ModelSerializer):
    """Serializer for Candidate model"""
    
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    job_opening_title = serializers.CharField(source='job_opening.title', read_only=True)
    job_opening_id = serializers.CharField(source='job_opening.job_opening_id', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Candidate
        fields = [
            'id',
            'candidate_id',
            'name',
            'email',
            'phone',
            'location',
            'job_opening',
            'job_opening_title',
            'job_opening_id',
            'designation',
            'designation_name',
            'department',
            'department_name',
            'education',
            'experience',
            'skills',
            'skill_ratings',
            'status',
            'applied_date',
            'last_contact',
            'source',
            'rating',
            'notes',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'rating']


class CandidateListSerializer(serializers.ModelSerializer):
    """Simplified serializer for candidate lists"""
    
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    job_opening_title = serializers.CharField(source='job_opening.title', read_only=True)
    job_opening_id = serializers.CharField(source='job_opening.job_opening_id', read_only=True)
    
    class Meta:
        model = Candidate
        fields = [
            'id',
            'candidate_id',
            'name',
            'email',
            'phone',
            'location',
            'job_opening_id',
            'job_opening_title',
            'designation_name',
            'department_name',
            'education',
            'experience',
            'status',
            'applied_date',
            'last_contact',
            'rating',
            'created_at'
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for Application model"""
    
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    job_opening_title = serializers.CharField(source='job_opening.title', read_only=True)
    job_opening_id = serializers.CharField(source='job_opening.job_opening_id', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id',
            'candidate',
            'candidate_name',
            'candidate_email',
            'job_opening',
            'job_opening_title',
            'job_opening_id',
            'status',
            'applied_date',
            'notes',
            'interview_date',
            'interview_notes',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'applied_date', 'created_at', 'updated_at']


class JobOpeningCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job openings"""
    
    class Meta:
        model = JobOpening
        fields = [
            'job_opening_id',
            'title',
            'designation',
            'department',
            'job_type',
            'description',
            'requirements',
            'experience_required',
            'salary_range',
            'manpower',
            'posted_date',
            'deadline',
            'status'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        print(f"Creating job opening with validated data: {validated_data}")
        return super().create(validated_data)
    
    def validate_job_opening_id(self, value):
        """Validate that job_opening_id is unique"""
        # Only check uniqueness if this is a new instance (not updating)
        if not self.instance and JobOpening.objects.filter(job_opening_id=value).exists():
            raise serializers.ValidationError("A job opening with this ID already exists.")
        return value


class CandidateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating candidates"""
    
    class Meta:
        model = Candidate
        fields = [
            'candidate_id',
            'name',
            'email',
            'phone',
            'location',
            'job_opening',
            'designation',
            'department',
            'education',
            'experience',
            'skills',
            'skill_ratings',
            'status',
            'applied_date',
            'last_contact',
            'source',
            'notes'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        
        # Auto-generate candidate_id if not provided
        if not validated_data.get('candidate_id'):
            # Generate candidate ID in format: CAND-YYYYMMDD-XXX
            from datetime import date
            today = date.today()
            date_str = today.strftime('%Y%m%d')
            
            # Find the next sequential number for today
            last_candidate = Candidate.objects.filter(
                candidate_id__startswith=f'CAND-{date_str}'
            ).order_by('-candidate_id').first()
            
            if last_candidate:
                # Extract the last number and increment
                last_number = int(last_candidate.candidate_id.split('-')[-1])
                next_number = last_number + 1
            else:
                next_number = 1
            
            validated_data['candidate_id'] = f'CAND-{date_str}-{next_number:03d}'
        
        return super().create(validated_data)
    
    def validate_candidate_id(self, value):
        """Validate that candidate_id is unique (if provided)"""
        if value and Candidate.objects.filter(candidate_id=value).exists():
            raise serializers.ValidationError("A candidate with this ID already exists.")
        return value
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if Candidate.objects.filter(email=value).exists():
            raise serializers.ValidationError("A candidate with this email already exists.")
        return value


class CandidateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating candidates"""
    
    class Meta:
        model = Candidate
        fields = [
            'candidate_id',
            'name',
            'email',
            'phone',
            'location',
            'job_opening',
            'designation',
            'department',
            'education',
            'experience',
            'skills',
            'skill_ratings',
            'status',
            'applied_date',
            'last_contact',
            'source',
            'notes'
        ]
    
    def validate_candidate_id(self, value):
        """Validate that candidate_id is unique (excluding current instance)"""
        if value:
            queryset = Candidate.objects.filter(candidate_id=value)
            if self.instance and self.instance.pk:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError("A candidate with this ID already exists.")
        return value
    
    def validate_email(self, value):
        """Validate email format and uniqueness (excluding current instance)"""
        if value:
            queryset = Candidate.objects.filter(email=value)
            if self.instance and self.instance.pk:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError("A candidate with this email already exists.")
        return value
    
    def update(self, instance, validated_data):
        # Update last_contact if status is being changed
        if 'status' in validated_data:
            from django.utils import timezone
            validated_data['last_contact'] = timezone.now().date()
        return super().update(instance, validated_data)
