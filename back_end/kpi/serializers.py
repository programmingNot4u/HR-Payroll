from rest_framework import serializers
from .models import EmployeeKPI, KPITemplate, KPIAssessmentHistory
from employees.models import Employee, Department, Designation, SkillMetric


class EmployeeKPISerializer(serializers.ModelSerializer):
    """Serializer for Employee KPI"""
    
    employee_id = serializers.IntegerField(source='employee.id', read_only=True)
    employee_name = serializers.SerializerMethodField()
    employee_designation = serializers.CharField(source='employee.designation.name', read_only=True)
    employee_department = serializers.CharField(source='employee.department.name', read_only=True)
    employee_level_of_work = serializers.CharField(source='employee.level_of_work', read_only=True)
    assessed_by_name = serializers.CharField(source='assessed_by.get_full_name', read_only=True)
    
    def get_employee_name(self, obj):
        """Get employee name - prefer English, fallback to Bangla"""
        return obj.employee.name_english or obj.employee.name_bangla or 'N/A'
    
    class Meta:
        model = EmployeeKPI
        fields = [
            'id',
            'employee',
            'employee_id',
            'employee_name',
            'employee_designation',
            'employee_department',
            'employee_level_of_work',
            'skill_ratings',
            'overall_score',
            'assessment_year',
            'assessment_month',
            'assessed_by',
            'assessed_by_name',
            'notes',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['overall_score', 'created_at', 'updated_at']
    
    def validate_skill_ratings(self, value):
        """Validate skill ratings format"""
        print(f"=== SKILL RATINGS VALIDATION ===")
        print(f"Value type: {type(value)}")
        print(f"Value: {value}")
        
        if not isinstance(value, dict):
            raise serializers.ValidationError("Skill ratings must be a dictionary")
        
        # Validate that all values are numbers between 0 and 5
        for skill, rating in value.items():
            print(f"Validating skill: {skill}, rating: {rating} (type: {type(rating)})")
            if not isinstance(rating, (int, float)):
                raise serializers.ValidationError(f"Rating for {skill} must be a number")
            if not (0 <= rating <= 5):
                raise serializers.ValidationError(f"Rating for {skill} must be between 0 and 5")
        
        print("Skill ratings validation passed")
        return value
    
    def create(self, validated_data):
        print("=== KPI CREATE DEBUG ===")
        print("Validated data:", validated_data)
        print("Request data:", self.context['request'].data)
        validated_data['assessed_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        print("=== KPI UPDATE DEBUG ===")
        print("Instance:", instance)
        print("Validated data:", validated_data)
        print("Request data:", self.context['request'].data)
        return super().update(instance, validated_data)


class EmployeeKPIListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing KPIs"""
    
    employee_id = serializers.IntegerField(source='employee.id', read_only=True)
    employee_name = serializers.SerializerMethodField()
    employee_designation = serializers.CharField(source='employee.designation.name', read_only=True)
    employee_department = serializers.CharField(source='employee.department.name', read_only=True)
    employee_level_of_work = serializers.CharField(source='employee.level_of_work', read_only=True)
    
    def get_employee_name(self, obj):
        """Get employee name - prefer English, fallback to Bangla"""
        return obj.employee.name_english or obj.employee.name_bangla or 'N/A'
    
    class Meta:
        model = EmployeeKPI
        fields = [
            'id',
            'employee_id',
            'employee_name',
            'employee_designation',
            'employee_department',
            'employee_level_of_work',
            'overall_score',
            'assessment_year',
            'assessment_month',
            'created_at'
        ]


class KPITemplateSerializer(serializers.ModelSerializer):
    """Serializer for KPI Templates"""
    
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = KPITemplate
        fields = [
            'id',
            'name',
            'description',
            'designation',
            'department',
            'soft_skills',
            'technical_skills',
            'is_active',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class KPIAssessmentHistorySerializer(serializers.ModelSerializer):
    """Serializer for KPI Assessment History"""
    
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = KPIAssessmentHistory
        fields = [
            'id',
            'action',
            'old_value',
            'new_value',
            'changed_by',
            'changed_by_name',
            'changed_at',
            'notes'
        ]


class EmployeeWithKPISerializer(serializers.ModelSerializer):
    """Serializer for employees with their KPI data"""
    
    # Employee fields
    name = serializers.SerializerMethodField()
    designation = serializers.CharField(source='designation.name', read_only=True)
    department = serializers.CharField(source='department.name', read_only=True)
    level_of_work = serializers.CharField(read_only=True)
    
    # KPI data
    kpi_data = serializers.SerializerMethodField()
    skill_ratings = serializers.SerializerMethodField()
    overall_score = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'designation',
            'department',
            'level_of_work',
            'status',
            'kpi_data',
            'skill_ratings',
            'overall_score'
        ]
    
    def get_name(self, obj):
        """Get employee name - prefer English, fallback to Bangla"""
        return obj.name_english or obj.name_bangla or 'N/A'
    
    def get_kpi_data(self, obj):
        """Get latest KPI data for the employee"""
        latest_kpi = obj.kpi_ratings.order_by('-assessment_year', '-assessment_month').first()
        if latest_kpi:
            return {
                'id': latest_kpi.id,
                'overall_score': latest_kpi.overall_score,
                'assessment_year': latest_kpi.assessment_year,
                'assessment_month': latest_kpi.assessment_month,
                'assessed_by': latest_kpi.assessed_by.get_full_name() if latest_kpi.assessed_by else None,
                'created_at': latest_kpi.created_at
            }
        return None
    
    def get_skill_ratings(self, obj):
        """Get latest skill ratings for the employee"""
        latest_kpi = obj.kpi_ratings.order_by('-assessment_year', '-assessment_month').first()
        if latest_kpi:
            return latest_kpi.skill_ratings
        return {}
    
    def get_overall_score(self, obj):
        """Get latest overall score for the employee"""
        latest_kpi = obj.kpi_ratings.order_by('-assessment_year', '-assessment_month').first()
        if latest_kpi:
            return latest_kpi.overall_score
        return 0.0


class SkillMetricSerializer(serializers.ModelSerializer):
    """Serializer for skill metrics from employees app"""
    
    class Meta:
        model = SkillMetric
        fields = ['id', 'name', 'description', 'category', 'designation', 'department', 'skills', 'is_active']


class KPIDashboardSerializer(serializers.Serializer):
    """Serializer for KPI dashboard statistics"""
    
    total_employees = serializers.IntegerField()
    total_assessments = serializers.IntegerField()
    average_score = serializers.FloatField()
    high_performers = serializers.IntegerField()
    low_performers = serializers.IntegerField()
    department_stats = serializers.DictField()
    designation_stats = serializers.DictField()
    monthly_trends = serializers.DictField()

