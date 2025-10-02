from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()

urlpatterns = [
    # Machine Management
    path('machines/', views.AttendanceMachineListCreateView.as_view(), name='machine-list'),
    path('machines/<int:pk>/', views.AttendanceMachineDetailView.as_view(), name='machine-detail'),
    path('machines/<str:machine_id>/test/', views.test_machine_connection, name='test-machine-connection'),
    
    # Daily Attendance
    path('daily-attendance/', views.DailyAttendanceListCreateView.as_view(), name='daily-attendance-list'),
    path('daily-attendance/<int:pk>/', views.DailyAttendanceDetailView.as_view(), name='daily-attendance-detail'),
    path('daily-attendance/summary/', views.daily_attendance_summary, name='daily-attendance-summary'),
    
    # Leave Management
    path('leave-policies/', views.LeavePolicyListCreateView.as_view(), name='leave-policy-list'),
    path('leave-policies/<int:pk>/', views.LeavePolicyDetailView.as_view(), name='leave-policy-detail'),
    
    path('leave-balances/', views.LeaveBalanceListCreateView.as_view(), name='leave-balance-list'),
    
    path('leave-requests/', views.LeaveRequestListCreateView.as_view(), name='leave-request-list'),
    path('leave-requests/<str:request_id>/', views.LeaveRequestDetailView.as_view(), name='leave-request-detail'),
    path('leave-requests/<str:request_id>/approve/', views.approve_leave_request, name='approve-leave-request'),
    path('leave-requests/<str:request_id>/reject/', views.reject_leave_request, name='reject-leave-request'),
    
    # Holidays
    path('holidays/', views.HolidayListCreateView.as_view(), name='holiday-list'),
    path('holidays/<int:pk>/', views.HolidayDetailView.as_view(), name='holiday-detail'),
    
    # Settings
    path('settings/', views.AttendanceSettingsView.as_view(), name='attendance-settings'),
    
    # System Status
    path('system-status/', views.system_status, name='system-status'),
    path('statistics/', views.attendance_statistics, name='attendance-statistics'),
]

