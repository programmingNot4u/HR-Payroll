from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'employees', views.EmployeeKPIViewSet, basename='employee-kpi')
router.register(r'templates', views.KPITemplateViewSet, basename='kpi-template')
router.register(r'history', views.KPIAssessmentHistoryViewSet, basename='kpi-history')

urlpatterns = [
    path('', include(router.urls)),
    
    # Dashboard and statistics
    path('dashboard/', views.KPIDashboardView.as_view(), name='kpi-dashboard'),
    path('statistics/', views.KPIStatisticsView.as_view(), name='kpi-statistics'),
    
    # Employee list for KPI management
    path('active-staff/', views.ActiveStaffEmployeesView.as_view(), name='active-staff-employees'),
    
    # Employee-specific endpoints
    path('employees/<int:employee_id>/ratings/', views.EmployeeKPIRatingsView.as_view(), name='employee-kpi-ratings'),
    path('employees/<int:employee_id>/ratings/latest/', views.EmployeeLatestKPIView.as_view(), name='employee-latest-kpi'),
    path('employees/<int:employee_id>/skills/', views.EmployeeSkillsView.as_view(), name='employee-skills'),
    
    # Skill metrics
    path('skill-metrics/', views.SkillMetricsView.as_view(), name='skill-metrics'),
    path('skill-metrics/soft-skills/', views.SoftSkillsView.as_view(), name='soft-skills'),
    path('skill-metrics/technical-skills/', views.TechnicalSkillsView.as_view(), name='technical-skills'),
    
    # Bulk operations
    path('bulk-update/', views.BulkUpdateKPIsView.as_view(), name='bulk-update-kpis'),
    path('bulk-create/', views.BulkCreateKPIsView.as_view(), name='bulk-create-kpis'),
    
    # Export/Import
    path('export/', views.ExportKPIsView.as_view(), name='export-kpis'),
    path('import/', views.ImportKPIsView.as_view(), name='import-kpis'),
]
