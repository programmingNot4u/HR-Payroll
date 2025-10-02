# employees/views.py

from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Employee, Department, Designation, SalaryGrade, SkillMetric, ProcessExpertise, Operation, Machine
from .serializers import (
    EmployeeListSerializer, EmployeeDetailSerializer, EmployeeCreateSerializer,
    EmployeeUpdateSerializer, EmployeeSearchSerializer, EmployeeLoginSerializer,
    EmployeeCredentialsSerializer,
    DepartmentSerializer, DesignationSerializer, SalaryGradeSerializer,
    SkillMetricSerializer, ProcessExpertiseSerializer, OperationSerializer, MachineSerializer
)

User = get_user_model()

# ===== ORGANIZATIONAL DATA VIEWS =====

class DepartmentListCreateView(generics.ListCreateAPIView):
    """List and create departments"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a department"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class DesignationListCreateView(generics.ListCreateAPIView):
    """List and create designations"""
    queryset = Designation.objects.select_related('department')
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'level', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['department', 'name']

class DesignationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a designation"""
    queryset = Designation.objects.select_related('department')
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated]

class SalaryGradeListCreateView(generics.ListCreateAPIView):
    """List and create salary grades"""
    queryset = SalaryGrade.objects.all()
    serializer_class = SalaryGradeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['grade_type', 'is_active']
    search_fields = ['name']
    ordering_fields = ['name', 'gross_salary']
    ordering = ['grade_type', 'name']

class SalaryGradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a salary grade"""
    queryset = SalaryGrade.objects.all()
    serializer_class = SalaryGradeSerializer
    permission_classes = [IsAuthenticated]

class SkillMetricListCreateView(generics.ListCreateAPIView):
    """List and create skill metrics"""
    queryset = SkillMetric.objects.all()
    serializer_class = SkillMetricSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'category']
    ordering = ['category', 'name']

class SkillMetricDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a skill metric"""
    queryset = SkillMetric.objects.all()
    serializer_class = SkillMetricSerializer
    permission_classes = [IsAuthenticated]

class ProcessExpertiseListCreateView(generics.ListCreateAPIView):
    """List and create process expertise"""
    queryset = ProcessExpertise.objects.all()
    serializer_class = ProcessExpertiseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['operation', 'machine']
    ordering_fields = ['operation', 'machine']
    ordering = ['operation', 'machine']

class ProcessExpertiseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a process expertise"""
    queryset = ProcessExpertise.objects.all()
    serializer_class = ProcessExpertiseSerializer
    permission_classes = [IsAuthenticated]

# ===== OPERATIONS AND MACHINES VIEWS =====

class OperationListCreateView(generics.ListCreateAPIView):
    queryset = Operation.objects.all()
    serializer_class = OperationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
    
    def create(self, request, *args, **kwargs):
        print(f"Operation create request data: {request.data}")
        return super().create(request, *args, **kwargs)

class OperationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Operation.objects.all()
    serializer_class = OperationSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        print(f"Operation update request data: {request.data}")
        print(f"Operation update ID: {kwargs.get('pk')}")
        try:
            response = super().update(request, *args, **kwargs)
            print(f"Operation update response: {response.data}")
            return response
        except Exception as e:
            print(f"Operation update error: {str(e)}")
            raise

class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
    
    def create(self, request, *args, **kwargs):
        print(f"Machine create request data: {request.data}")
        return super().create(request, *args, **kwargs)

class MachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        print(f"Machine update request data: {request.data}")
        print(f"Machine update ID: {kwargs.get('pk')}")
        try:
            response = super().update(request, *args, **kwargs)
            print(f"Machine update response: {response.data}")
            return response
        except Exception as e:
            print(f"Machine update error: {str(e)}")
            raise

# ===== EMPLOYEE VIEWS =====

class EmployeeListCreateView(generics.ListCreateAPIView):
    """List employees and create new employees"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'designation', 'status', 'level_of_work', 'gender', 'salary_grade']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'user__email', 'name_english', 'name_bangla']
    ordering_fields = ['employee_id', 'date_of_joining', 'user__first_name', 'created_at']
    ordering = ['-created_at']
    pagination_class = None  # We'll add custom pagination
    
    def create(self, request, *args, **kwargs):
        print(f"=== EMPLOYEE CREATE REQUEST ===")
        print(f"Request data: {request.data}")
        print(f"Request user: {request.user}")
        print(f"Request method: {request.method}")
        print(f"Request FILES: {request.FILES}")
        print(f"Picture field in data: {request.data.get('picture')}")
        print(f"Picture field type: {type(request.data.get('picture'))}")
        
        try:
            response = super().create(request, *args, **kwargs)
            print(f"Employee created successfully: {response.data}")
            return response
        except Exception as e:
            print(f"Error creating employee: {str(e)}")
            print(f"Error type: {type(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    def get_queryset(self):
        """Filter employees based on user role"""
        queryset = Employee.objects.select_related(
            'user', 'department', 'designation', 'salary_grade', 'reporting_manager__user'
        )
        
        # Role-based filtering
        if self.request.user.role == 'employee':
            # Employees can only see themselves
            return queryset.filter(user=self.request.user)
        elif self.request.user.role == 'department_head':
            # Department heads can see their department employees
            return queryset.filter(department__head=self.request.user)
        elif self.request.user.role in ['hr_staff', 'hr_manager', 'super_admin']:
            # HR staff can see all employees
            return queryset
        else:
            # Default: employees can only see themselves
            return queryset.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EmployeeCreateSerializer
        return EmployeeListSerializer
    
    def list(self, request, *args, **kwargs):
        """Override list method to add custom pagination and filtering"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Get search and filter parameters
        search_term = request.query_params.get('search', '').strip()
        department_filter = request.query_params.get('department', '').strip()
        designation_filter = request.query_params.get('designation', '').strip()
        status_filter = request.query_params.get('status', '').strip()
        level_filter = request.query_params.get('level', '').strip()
        process_expertise_filter = request.query_params.get('process_expertise', '').strip()
        machine_filter = request.query_params.get('machine', '').strip()
        
        # Apply custom filters
        if search_term:
            queryset = queryset.filter(
                Q(employee_id__icontains=search_term) |
                Q(user__first_name__icontains=search_term) |
                Q(user__last_name__icontains=search_term) |
                Q(user__email__icontains=search_term) |
                Q(name_english__icontains=search_term) |
                Q(name_bangla__icontains=search_term) |
                Q(user__phone__icontains=search_term)
            )
        
        if department_filter and department_filter != 'All':
            queryset = queryset.filter(department__name__icontains=department_filter)
        
        if designation_filter and designation_filter != 'All':
            queryset = queryset.filter(designation__name__icontains=designation_filter)
        
        if status_filter and status_filter != 'All':
            queryset = queryset.filter(status__icontains=status_filter)
        
        if level_filter and level_filter != 'All':
            queryset = queryset.filter(level_of_work__icontains=level_filter)
        
        if process_expertise_filter and process_expertise_filter != 'All':
            # Filter by process expertise operation
            queryset = queryset.filter(process_expertise__contains=[{'operation': process_expertise_filter}])
        
        if machine_filter and machine_filter != 'All':
            # Filter by process expertise machine
            queryset = queryset.filter(process_expertise__contains=[{'machine': machine_filter}])
        
        # Get pagination parameters
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        # Validate pagination parameters
        if page < 1:
            page = 1
        if page_size < 1 or page_size > 100:
            page_size = 10
            
        # Calculate pagination
        total_count = queryset.count()
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        
        # Get paginated data
        paginated_queryset = queryset[start_index:end_index]
        
        # Serialize data
        serializer = self.get_serializer(paginated_queryset, many=True)
        
        # Calculate pagination info
        total_pages = (total_count + page_size - 1) // page_size
        has_next = page < total_pages
        has_previous = page > 1
        
        # Return paginated response
        return Response({
            'count': total_count,
            'next': f"?page={page + 1}&page_size={page_size}" if has_next else None,
            'previous': f"?page={page - 1}&page_size={page_size}" if has_previous else None,
            'results': serializer.data,
            'pagination': {
                'current_page': page,
                'page_size': page_size,
                'total_pages': total_pages,
                'has_next': has_next,
                'has_previous': has_previous,
                'start_index': start_index + 1 if total_count > 0 else 0,
                'end_index': min(end_index, total_count)
            },
            'filters_applied': {
                'search': search_term,
                'department': department_filter,
                'designation': designation_filter,
                'status': status_filter,
                'level': level_filter,
                'process_expertise': process_expertise_filter,
                'machine': machine_filter
            }
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_employees_for_stats(request):
    """Get all employees for statistics without pagination"""
    try:
        # Get all employees without pagination
        employees = Employee.objects.select_related('user', 'department', 'designation', 'salary_grade').prefetch_related('process_expertise__operation', 'process_expertise__machine').all()
        
        # Apply role-based filtering
        if request.user.role == 'employee':
            employees = employees.filter(user=request.user)
        elif request.user.role == 'department_head':
            employees = employees.filter(department__head=request.user)
        # For hr_staff, hr_manager, super_admin - no additional filtering
        
        serializer = EmployeeListSerializer(employees, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an employee"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter employees based on user role"""
        queryset = Employee.objects.select_related(
            'user', 'department', 'designation', 'salary_grade', 'reporting_manager__user'
        )
        
        # Role-based filtering
        if self.request.user.role == 'employee':
            return queryset.filter(user=self.request.user)
        elif self.request.user.role == 'department_head':
            return queryset.filter(department__head=self.request.user)
        elif self.request.user.role in ['hr_staff', 'hr_manager', 'super_admin']:
            return queryset
        else:
            return queryset.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EmployeeUpdateSerializer
        return EmployeeDetailSerializer

# ===== EMPLOYEE LOGIN VIEW =====

class EmployeeLoginView(APIView):
    """Employee login with employee_id and password"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = EmployeeLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        employee_id = serializer.validated_data['employee_id']
        password = serializer.validated_data['password']
        
        try:
            # Find employee by employee_id
            employee = Employee.objects.select_related('user', 'department', 'designation').get(
                employee_id=employee_id
            )
            
            # Check if password matches the generated password
            if employee.user.check_password(password):
                # Generate JWT tokens
                refresh = RefreshToken.for_user(employee.user)
                access_token = refresh.access_token
                
                # Return employee data with tokens
                employee_data = {
                    'employee_id': employee.employee_id,
                    'email': employee.user.email,
                    'password': employee.generated_password,  # Return the actual generated password
                    'full_name': employee.user.full_name,
                    'department': employee.department.name,
                    'designation': employee.designation.name,
                    'level_of_work': employee.level_of_work,
                    'status': employee.status,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(access_token)
                    }
                }
                
                return Response(employee_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Invalid credentials'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

# ===== API ENDPOINTS =====

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_stats(request):
    """Get employee statistics"""
    # Check permissions
    if request.user.role not in ['hr_staff', 'hr_manager', 'super_admin']:
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    stats = {
        'total_employees': Employee.objects.count(),
        'active_employees': Employee.objects.filter(status='active').count(),
        'inactive_employees': Employee.objects.filter(status='inactive').count(),
        'on_leave_employees': Employee.objects.filter(status='on_leave').count(),
        'terminated_employees': Employee.objects.filter(status='terminated').count(),
        'departments': Department.objects.count(),
        'designations': Designation.objects.count(),
        'workers': Employee.objects.filter(level_of_work='worker').count(),
        'staff': Employee.objects.filter(level_of_work='staff').count(),
        'salary_grades': SalaryGrade.objects.count(),
        'skill_metrics': SkillMetric.objects.count(),
        'process_expertise': ProcessExpertise.objects.count(),
    }
    
    # Department-wise breakdown
    department_stats = []
    for dept in Department.objects.all():
        dept_count = Employee.objects.filter(department=dept).count()
        department_stats.append({
            'name': dept.name,
            'count': dept_count
        })
    
    stats['department_breakdown'] = department_stats
    
    return Response(stats)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def employee_search(request):
    """Search employees with advanced filters"""
    # Check permissions
    if request.user.role not in ['hr_staff', 'hr_manager', 'super_admin']:
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = EmployeeSearchSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    query = data.get('query', '')
    
    # Build search query
    search_query = Q()
    
    if query:
        search_query &= (
            Q(employee_id__icontains=query) |
            Q(user__first_name__icontains=query) |
            Q(user__last_name__icontains=query) |
            Q(user__email__icontains=query) |
            Q(name_english__icontains=query) |
            Q(name_bangla__icontains=query) |
            Q(department__name__icontains=query) |
            Q(designation__name__icontains=query)
        )
    
    if data.get('department'):
        search_query &= Q(department_id=data['department'])
    
    if data.get('designation'):
        search_query &= Q(designation_id=data['designation'])
    
    if data.get('status'):
        search_query &= Q(status=data['status'])
    
    if data.get('level_of_work'):
        search_query &= Q(level_of_work=data['level_of_work'])
    
    if data.get('gender'):
        search_query &= Q(gender=data['gender'])
    
    employees = Employee.objects.filter(search_query).select_related(
        'user', 'department', 'designation', 'salary_grade', 'reporting_manager__user'
    )
    
    serializer = EmployeeListSerializer(employees, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_dashboard_data(request):
    """Get data for employee dashboard"""
    if request.user.role != 'employee':
        return Response(
            {'error': 'This endpoint is for employees only'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        employee = Employee.objects.select_related('user', 'department', 'designation', 'salary_grade').get(
            user=request.user
        )
        
        data = {
            'employee_id': employee.employee_id,
            'full_name': employee.full_name,
            'email': employee.email,
            'phone': employee.phone,
            'department': employee.department.name,
            'designation': employee.designation.name,
            'level_of_work': employee.level_of_work,
            'gender': employee.gender,
            'date_of_joining': employee.date_of_joining,
            'status': employee.status,
            'reporting_manager': employee.reporting_manager.user.full_name if employee.reporting_manager else None,
            'salary_grade': employee.salary_grade.name if employee.salary_grade else None,
            'gross_salary': employee.gross_salary,
            'salary_components': employee.salary_components,
            'total_salary_components': employee.get_total_salary_components(),
        }
        
        return Response(data)
    
    except Employee.DoesNotExist:
        return Response(
            {'error': 'Employee profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def organizational_data(request):
    """Get all organizational data for frontend dropdowns"""
    data = {
        'departments': DepartmentSerializer(Department.objects.filter(is_active=True), many=True).data,
        'designations': DesignationSerializer(Designation.objects.filter(is_active=True), many=True).data,
        'salary_grades': SalaryGradeSerializer(SalaryGrade.objects.filter(is_active=True), many=True).data,
        'skill_metrics': SkillMetricSerializer(SkillMetric.objects.filter(is_active=True), many=True).data,
        'process_expertise': ProcessExpertiseSerializer(ProcessExpertise.objects.filter(is_active=True), many=True).data,
    }
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_employees(request):
    """Get recently added employees for dashboard"""
    try:
        # Get employees added in the last 30 days
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        recent_employees = Employee.objects.filter(
            created_at__gte=thirty_days_ago
        ).select_related('user', 'department', 'designation').order_by('-created_at')[:10]
        
        serializer = EmployeeListSerializer(recent_employees, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_activity_log(request, employee_id):
    """Get activity log for a specific employee"""
    try:
        employee = Employee.objects.get(id=employee_id)
        
        # This is a placeholder - you would implement actual activity logging
        # For now, return some mock data
        activity_log = [
            {
                'id': 1,
                'action': 'Profile Updated',
                'description': 'Personal information was updated',
                'timestamp': employee.updated_at.isoformat(),
                'user': 'System'
            },
            {
                'id': 2,
                'action': 'Employee Created',
                'description': 'Employee profile was created',
                'timestamp': employee.created_at.isoformat(),
                'user': 'HR Admin'
            }
        ]
        
        return Response(activity_log)
    
    except Employee.DoesNotExist:
        return Response(
            {'error': 'Employee not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_employee_count(request):
    """Get employee count by department"""
    try:
        departments = Department.objects.filter(is_active=True)
        department_counts = []
        
        for dept in departments:
            active_count = Employee.objects.filter(
                department=dept, 
                status='active'
            ).count()
            total_count = Employee.objects.filter(department=dept).count()
            
            department_counts.append({
                'department_id': dept.id,
                'department_name': dept.name,
                'active_employees': active_count,
                'total_employees': total_count
            })
        
        return Response(department_counts)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_credentials(request, employee_id):
    """Get employee credentials for HR staff"""
    # Check permissions
    if request.user.role not in ['hr_staff', 'hr_manager', 'super_admin']:
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        employee = Employee.objects.select_related('user', 'department', 'designation').get(
            employee_id=employee_id
        )
        
        credentials = {
            'employee_id': employee.employee_id,
            'email': employee.user.email,
            'password': employee.employee_id,  # Password is same as employee_id
            'full_name': employee.user.full_name,
            'department': employee.department.name,
            'designation': employee.designation.name,
        }
        
        return Response(credentials)
    
    except Employee.DoesNotExist:
        return Response(
            {'error': 'Employee not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def operation_delete_by_name(request, name):
    """Delete operation by name"""
    try:
        operation = Operation.objects.get(name=name)
        operation.delete()
        return Response({'message': 'Operation deleted successfully'}, status=status.HTTP_200_OK)
    except Operation.DoesNotExist:
        return Response(
            {'error': 'Operation not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def machine_delete_by_name(request, name):
    """Delete machine by name"""
    try:
        machine = Machine.objects.get(name=name)
        machine.delete()
        return Response({'message': 'Machine deleted successfully'}, status=status.HTTP_200_OK)
    except Machine.DoesNotExist:
        return Response(
            {'error': 'Machine not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )