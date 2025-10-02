from django.urls import path
from . import views

urlpatterns = [
    path('admin-login/', views.admin_login, name='admin_login'),
    path('employee-login/', views.employee_login, name='employee_login'),
    path('unified-login/', views.unified_login, name='unified_login'),
    path('change-password/', views.change_password, name='change_password'),
    path('refresh-token/', views.refresh_token, name='refresh_token'),
]