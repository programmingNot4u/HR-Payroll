# employees/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # ===== ORGANIZATIONAL DATA URLs =====
    # Departments
    path('departments/', views.DepartmentListCreateView.as_view(), name='department_list'),
    path('departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='department_detail'),
    
    # Designations
    path('designations/', views.DesignationListCreateView.as_view(), name='designation_list'),
    path('designations/<int:pk>/', views.DesignationDetailView.as_view(), name='designation_detail'),
    
    # Salary Grades
    path('salary-grades/', views.SalaryGradeListCreateView.as_view(), name='salary_grade_list'),
    path('salary-grades/<int:pk>/', views.SalaryGradeDetailView.as_view(), name='salary_grade_detail'),
    
    # Skill Metrics
    path('skill-metrics/', views.SkillMetricListCreateView.as_view(), name='skill_metric_list'),
    path('skill-metrics/<int:pk>/', views.SkillMetricDetailView.as_view(), name='skill_metric_detail'),
    
    # Process Expertise
    path('process-expertise/', views.ProcessExpertiseListCreateView.as_view(), name='process_expertise_list'),
    path('process-expertise/<int:pk>/', views.ProcessExpertiseDetailView.as_view(), name='process_expertise_detail'),
    
    # Operations and Machines
    path('operations/', views.OperationListCreateView.as_view(), name='operation_list'),
    path('operations/<int:pk>/', views.OperationDetailView.as_view(), name='operation_detail'),
    path('operations/add/', views.OperationListCreateView.as_view(), name='operation_add'),
    path('operations/<str:name>/delete/', views.operation_delete_by_name, name='operation_delete_by_name'),
    path('machines/', views.MachineListCreateView.as_view(), name='machine_list'),
    path('machines/<int:pk>/', views.MachineDetailView.as_view(), name='machine_detail'),
    path('machines/add/', views.MachineListCreateView.as_view(), name='machine_add'),
    path('machines/<str:name>/delete/', views.machine_delete_by_name, name='machine_delete_by_name'),
    
    # ===== EMPLOYEE URLs =====
    # Employee CRUD
    path('employees/', views.EmployeeListCreateView.as_view(), name='employee_list'),
    path('employees/<int:pk>/', views.EmployeeDetailView.as_view(), name='employee_detail'),
    
    # Employee Login
    path('employees/login/', views.EmployeeLoginView.as_view(), name='employee_login'),
    
    # Employee Utilities
    path('employees/stats/', views.employee_stats, name='employee_stats'),
    path('employees/search/', views.employee_search, name='employee_search'),
    path('employees/dashboard/', views.employee_dashboard_data, name='employee_dashboard'),
    path('employees/recent/', views.recent_employees, name='recent_employees'),
    path('employees/<int:employee_id>/activity/', views.employee_activity_log, name='employee_activity_log'),
    path('employees/department-count/', views.department_employee_count, name='department_employee_count'),
    path('employees/all-for-stats/', views.get_all_employees_for_stats, name='get_all_employees_for_stats'),
    path('employees/<str:employee_id>/credentials/', views.employee_credentials, name='employee_credentials'),
    
    # ===== ORGANIZATIONAL DATA ENDPOINT =====
    path('organizational-data/', views.organizational_data, name='organizational_data'),
]