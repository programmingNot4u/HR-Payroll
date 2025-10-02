# employees/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Employee, Department, Designation, SalaryGrade, SkillMetric, ProcessExpertise, Operation, Machine
import secrets
import string

User = get_user_model()

# ===== ORGANIZATIONAL DATA SERIALIZERS =====

class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='head.full_name', read_only=True)
    employee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'head', 'head_name', 'is_active', 'employee_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'employee_count']
    
    def get_employee_count(self, obj):
        return obj.employees.count()

class DesignationSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    employee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Designation
        fields = ['id', 'name', 'department', 'department_name', 'level', 'description', 'is_active', 'employee_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'employee_count']
    
    def get_employee_count(self, obj):
        return obj.employees.count()

class SalaryGradeSerializer(serializers.ModelSerializer):
    calculated_gross = serializers.SerializerMethodField()
    
    class Meta:
        model = SalaryGrade
        fields = ['id', 'name', 'grade_type', 'basic_salary', 'house_rent', 'medical_allowance', 
                 'conveyance', 'food_allowance', 'mobile_bill', 'gross_salary', 'calculated_gross', 
                 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'calculated_gross']
    
    def get_calculated_gross(self, obj):
        return obj.calculate_gross_salary()

class SkillMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMetric
        fields = ['id', 'name', 'description', 'category', 'designation', 'department', 'skills', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class OperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operation
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ProcessExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessExpertise
        fields = ['id', 'operation', 'machine', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

# ===== EMPLOYEE SERIALIZERS =====

class EmployeeListSerializer(serializers.ModelSerializer):
    """Serializer for employee list view (minimal data)"""
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    salary_grade_name = serializers.CharField(source='salary_grade.name', read_only=True)
    reporting_manager_name = serializers.CharField(source='reporting_manager.user.full_name', read_only=True)
    
    # Process expertise fields
    process_expertise = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = [
            'id', 'employee_id', 'full_name', 'email', 'phone',
            'department', 'department_name', 'designation', 'designation_name',
            'level_of_work', 'gender', 'status', 'date_of_joining',
            'salary_grade', 'salary_grade_name', 'gross_salary',
            'reporting_manager', 'reporting_manager_name', 'process_expertise',
            'created_at'
        ]
        read_only_fields = ['created_at']
    
    def get_process_expertise(self, obj):
        """Get process expertise with operation and machine names"""
        if not obj.process_expertise:
            return []
        
        expertise_list = []
        for expertise in obj.process_expertise:
            expertise_list.append({
                'id': expertise.get('id'),
                'operation': {
                    'id': expertise.get('operation'),
                    'name': expertise.get('operation')
                } if expertise.get('operation') else None,
                'machine': {
                    'id': expertise.get('machine'),
                    'name': expertise.get('machine')
                } if expertise.get('machine') else None,
                'is_active': expertise.get('is_active', True)
            })
        return expertise_list

class EmployeeDetailSerializer(serializers.ModelSerializer):
    """Serializer for employee detail view (complete data)"""
    # User fields
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    role = serializers.CharField(source='user.role', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active')
    
    # Related object names
    department_name = serializers.CharField(source='department.name', read_only=True)
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    salary_grade_name = serializers.CharField(source='salary_grade.name', read_only=True)
    reporting_manager_name = serializers.CharField(source='reporting_manager.user.full_name', read_only=True)
    
    # Calculated fields
    total_salary_components = serializers.SerializerMethodField()
    
    # Field mappings for frontend compatibility
    workExperience = serializers.JSONField(source='work_experience', read_only=True)
    processExpertise = serializers.JSONField(source='process_expertise', read_only=True)
    processEfficiency = serializers.JSONField(source='process_efficiency', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            # Basic Info
            'id', 'employee_id', 'first_name', 'last_name', 'email', 'phone',
            'role', 'is_active', 'created_at', 'updated_at',
            
            # Organizational
            'department', 'department_name', 'designation', 'designation_name',
            'level_of_work', 'status', 'reporting_manager', 'reporting_manager_name',
            
            # Personal Information
            'picture', 'name_bangla', 'name_english', 'mobile_number', 'email_address',
            'nationality', 'fathers_name', 'mothers_name', 'spouse_name',
            'date_of_birth', 'nid_number', 'birth_certificate_number',
            'blood_group', 'religion', 'marital_status', 'height', 'weight',
            'education_level', 'subject', 'gender',
            
            # Family & Address
            'children', 'present_address', 'permanent_address',
            
            # Work Experience
            'has_work_experience', 'work_experience', 'workExperience',
            
            # Process Expertise (for Workers)
            'process_expertise', 'process_efficiency', 'processExpertise', 'processEfficiency',
            
            # Emergency & Nominee
            'nominee', 'emergency_contact',
            
            # Administration
            'off_day', 'unit', 'line', 'supervisor_name',
            'salary_grade', 'salary_grade_name', 'gross_salary',
            'date_of_joining', 'date_of_issue',
            
            # Salary Components
            'salary_components', 'total_salary_components',
            
            # Generated Credentials
            'generated_email', 'generated_password'
        ]
        read_only_fields = ['created_at', 'updated_at', 'role', 'total_salary_components', 'generated_email', 'generated_password']
    
    def get_total_salary_components(self, obj):
        return obj.get_total_salary_components()

class EmployeeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new employees with auto-generated credentials"""
    # User fields
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(write_only=True, required=False, help_text="Email for HR users")
    role = serializers.ChoiceField(
        choices=[
            ('employee', 'Employee'),
            ('hr_staff', 'HR Staff'),
            ('hr_manager', 'HR Manager'),
            ('department_head', 'Department Head'),
        ],
        write_only=True,
        required=False,
        default='employee',
        help_text="User's role in the system"
    )
    
    # Generated credentials (read-only)
    generated_email = serializers.CharField(read_only=True)
    generated_password = serializers.CharField(read_only=True)
    
    def validate(self, data):
        print(f"=== SERIALIZER VALIDATE ===")
        print(f"Data being validated: {data}")
        
        # Check for required fields
        required_fields = ['first_name', 'last_name', 'department', 'designation', 'level_of_work']
        for field in required_fields:
            if field not in data or not data[field]:
                print(f"Missing required field: {field}")
                raise serializers.ValidationError({field: f"{field} is required"})
        
        # Validate education level if provided
        if 'education_level' in data and data['education_level']:
            valid_choices = [choice[0] for choice in Employee.EDUCATION_LEVEL_CHOICES]
            if data['education_level'] not in valid_choices:
                print(f"Invalid education level: {data['education_level']}, valid choices: {valid_choices}")
                raise serializers.ValidationError({
                    'education_level': f"Invalid choice. Must be one of: {', '.join(valid_choices)}"
                })
        
        print("Validation passed")
        return data
    
    class Meta:
        model = Employee
        fields = [
            # Basic Info
            'id', 'employee_id',
            
            # User fields
            'first_name', 'last_name', 'phone', 'email', 'role',
            
            # Organizational
            'department', 'designation', 'level_of_work', 'status',
            'reporting_manager', 'salary_grade',
            
            # Personal Information
            'picture', 'name_bangla', 'name_english', 'mobile_number', 'email_address',
            'nationality', 'fathers_name', 'mothers_name', 'spouse_name',
            'date_of_birth', 'nid_number', 'birth_certificate_number',
            'blood_group', 'religion', 'marital_status', 'height', 'weight',
            'education_level', 'subject', 'gender',
            
            # Family & Address
            'children', 'present_address', 'permanent_address',
            
            # Work Experience
            'has_work_experience', 'work_experience',
            
            # Process Expertise (for Workers)
            'process_expertise', 'process_efficiency',
            
            # Emergency & Nominee
            'nominee', 'emergency_contact',
            
            # Administration
            'off_day', 'unit', 'line', 'supervisor_name',
            'gross_salary', 'date_of_joining', 'date_of_issue',
            
            # Salary Components
            'salary_components',
            
            # Generated credentials
            'generated_email', 'generated_password'
        ]
        read_only_fields = ['id', 'generated_email', 'generated_password']
    
    def generate_employee_id(self):
        """Generate unique employee ID"""
        last_employee = Employee.objects.order_by('-id').first()
        if last_employee:
            try:
                last_id = int(last_employee.employee_id.replace('EMP', ''))
                new_id = last_id + 1
            except (ValueError, AttributeError):
                new_id = 1
        else:
            new_id = 1
        return f"EMP{new_id:03d}"
    
    def create(self, validated_data):
        # Extract user data
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        phone = validated_data.pop('phone', '')
        role = validated_data.pop('role', 'employee')
        
        # Handle Employee ID - use manual if provided, otherwise auto-generate
        manual_employee_id = validated_data.pop('employee_id', None)
        
        
        if manual_employee_id and manual_employee_id.strip() and manual_employee_id != 'null' and manual_employee_id != 'undefined':
            # Use manually provided Employee ID
            employee_id = manual_employee_id.strip()
            print(f"Using manual Employee ID: {employee_id}")
            
            # Check if Employee ID already exists
            if Employee.objects.filter(employee_id=employee_id).exists():
                raise serializers.ValidationError({
                    'employee_id': f'Employee ID "{employee_id}" already exists. Please choose a different one.'
                })
        else:
            # Auto-generate Employee ID only if no manual ID provided
            employee_id = self.generate_employee_id()
            print(f"Auto-generated Employee ID: {employee_id}")
        
        # Handle email - use manual if provided, otherwise generate
        manual_email = validated_data.pop('email', None)
        manual_email_address = validated_data.pop('email_address', None)
        
        # Determine which email to use (prioritize email over email_address)
        user_email = None
        if manual_email and manual_email.strip():
            user_email = manual_email.strip()
            print(f"Using manual email: {user_email}")
        elif manual_email_address and manual_email_address.strip():
            user_email = manual_email_address.strip()
            print(f"Using manual email_address: {user_email}")
        
        # Generate password
        if role == 'employee':
            if user_email:
                # Use manual email with generated password
                generated_password = User.generate_hr_credentials(user_email, role)
                print(f"Using manual email with generated password - email: {user_email}, password: {generated_password}")
            else:
                # Generate both email and password
                generated_email, _ = User.generate_employee_credentials(employee_id, phone)
                user_email = generated_email
                generated_password = User.generate_hr_credentials(user_email, role)
                print(f"Generated employee credentials - email: {generated_email}, password: {generated_password}")
            
            # Create user
            user = User.objects.create_user(
                email=user_email,
                password=generated_password,
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                role=role,
                generated_password=generated_password
            )
        else:
            # For HR users: use provided email or generate one
            if not user_email:
                user_email = f"{first_name.lower()}.{last_name.lower()}@company.com"
                print(f"Generated HR email: {user_email}")
            else:
                print(f"Using manual HR email: {user_email}")
            
            generated_password = User.generate_hr_credentials(user_email, role)
            print(f"Generated HR password: {generated_password}")
            
            # Create user
            user = User.objects.create_user(
                email=user_email,
                password=generated_password,
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                role=role,
                generated_password=generated_password
            )
        print(f"User created: {user}")
        
        # Create employee
        employee = Employee.objects.create(
            user=user,
            employee_id=employee_id,
            **validated_data
        )
        print(f"Employee created: {employee}")
        
        # Save credentials to database fields
        employee.generated_email = user_email
        employee.generated_password = generated_password
        
        # Store the generated password in the user model for reference
        user.generated_password = generated_password
        user.save()
        
        # Save the employee with generated credentials
        employee.save()
        
        return employee

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating employee information"""
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone')
    is_active = serializers.BooleanField(source='user.is_active')
    
    class Meta:
        model = Employee
        fields = [
            # User fields
            'first_name', 'last_name', 'email', 'phone', 'is_active',
            
            # Organizational
            'department', 'designation', 'level_of_work', 'status',
            'reporting_manager', 'salary_grade',
            
            # Personal Information
            'picture', 'name_bangla', 'name_english', 'mobile_number', 'email_address',
            'nationality', 'fathers_name', 'mothers_name', 'spouse_name',
            'date_of_birth', 'nid_number', 'birth_certificate_number',
            'blood_group', 'religion', 'marital_status', 'height', 'weight',
            'education_level', 'subject', 'gender',
            
            # Family & Address
            'children', 'present_address', 'permanent_address',
            
            # Work Experience
            'has_work_experience', 'work_experience',
            
            # Process Expertise (for Workers)
            'process_expertise', 'process_efficiency',
            
            # Emergency & Nominee
            'nominee', 'emergency_contact',
            
            # Administration
            'off_day', 'unit', 'line', 'supervisor_name',
            'gross_salary', 'date_of_joining', 'date_of_issue',
            
            # Salary Components
            'salary_components'
        ]
        read_only_fields = ['email']  # Email cannot be changed after creation
    
    
    def update(self, instance, validated_data):
        # Handle nested user data
        user_data = validated_data.pop('user', {})
        
        # Update user instance if there are user fields to update
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Update employee instance with remaining data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class EmployeeSearchSerializer(serializers.Serializer):
    """Serializer for employee search functionality"""
    query = serializers.CharField(max_length=100)
    department = serializers.IntegerField(required=False)
    designation = serializers.IntegerField(required=False)
    status = serializers.CharField(required=False)
    level_of_work = serializers.CharField(required=False)
    gender = serializers.CharField(required=False)

class EmployeeLoginSerializer(serializers.Serializer):
    """Serializer for employee login with employee_id"""
    employee_id = serializers.CharField(max_length=20)
    password = serializers.CharField(max_length=128)

class EmployeeCredentialsSerializer(serializers.Serializer):
    """Serializer for employee credentials response"""
    employee_id = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    full_name = serializers.CharField()
    department = serializers.CharField()
    designation = serializers.CharField()
    
    