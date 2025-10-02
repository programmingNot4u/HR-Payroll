# authentication/views.py

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from employees.models import Employee
import re

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Admin/HR Manager login endpoint
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(email=email, password=password)
    
    if not user:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if user has admin/HR role
    if user.role not in ['super_admin', 'hr_manager', 'department_head']:
        return Response({
            'error': 'Access denied. Admin privileges required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    
    return Response({
        'access': str(access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': user.full_name,
            'role': user.role,
            'is_active': user.is_active
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def employee_login(request):
    """
    Employee login endpoint using phone number and employee_id
    """
    employee_id = request.data.get('employee_id')
    phone = request.data.get('phone')
    
    if not employee_id or not phone:
        return Response({
            'error': 'Employee ID and phone number are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find employee by employee_id
        employee = Employee.objects.get(employee_id=employee_id)
        user = employee.user
        
        # Check if employee is active
        if not employee.is_active():
            return Response({
                'error': 'Employee account is inactive'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if phone number matches
        if user.phone != phone:
            return Response({
                'error': 'Invalid phone number for this employee'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'full_name': user.full_name,
                'role': user.role,
                'is_active': user.is_active,
                'employee_id': employee.employee_id,
                'employee_type': employee.level_of_work,
                'department': employee.department.name if employee.department else None,
                'designation': employee.designation.name if employee.designation else None
            }
        }, status=status.HTTP_200_OK)
        
    except Employee.DoesNotExist:
        return Response({
            'error': 'Invalid employee ID'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def unified_login(request):
    """
    Unified login endpoint for both HR and employees
    Employee Portal: employee_id + password (for both Employee and HR Manager)
    HR Admin Portal: mobile/email + password (for HR Manager only)
    """
    username = request.data.get('username')  # employee_id, email, or phone
    password = request.data.get('password')  # generated password
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = None
        employee = None
        login_type = None
        
        # First, try to find by employee_id (Employee Portal login)
        # Check if it's a valid employee_id by trying to find it in the database
        try:
            employee = Employee.objects.get(employee_id=username)
            user = employee.user
            login_type = 'employee_portal'
        except Employee.DoesNotExist:
            pass
        
        # If not found by employee_id, try email (HR Admin Portal login)
        if not user and '@' in username:
            try:
                user = User.objects.get(email=username)
                # Check if this user has an employee record
                try:
                    employee = Employee.objects.get(user=user)
                    login_type = 'hr_admin_portal'
                except Employee.DoesNotExist:
                    # HR user without employee record
                    login_type = 'hr_admin_portal'
            except User.DoesNotExist:
                pass
        
        # If not found by email, try phone number (HR Admin Portal login)
        if not user:
            try:
                user = User.objects.get(phone=username)
                # Check if this user has an employee record
                try:
                    employee = Employee.objects.get(user=user)
                    login_type = 'hr_admin_portal'
                except Employee.DoesNotExist:
                    # HR user without employee record
                    login_type = 'hr_admin_portal'
            except User.DoesNotExist:
                pass
        
        if not user:
            return Response({
                'error': 'User not found with provided username'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user is active
        if not user.is_active:
            return Response({
                'error': 'User account is inactive'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Validate credentials based on login type
        if login_type == 'employee_portal':
            # Employee Portal login: check if password matches user's password
            if not user.check_password(password):
                return Response({
                    'error': 'Invalid password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if employee is active
            if employee and not employee.is_active():
                return Response({
                    'error': 'Employee account is inactive'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        elif login_type == 'hr_admin_portal':
            # HR Admin Portal login: check if password matches user's password
            if not user.check_password(password):
                return Response({
                    'error': 'Invalid password for HR user'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Prepare user data
        user_data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': user.full_name,
            'role': user.role,
            'is_active': user.is_active,
            'login_type': login_type,
        }
        
        # Add generated password for users who have it
        if user.generated_password:
            user_data['generated_password'] = user.generated_password
        
        # Add employee-specific data if it's an employee
        if employee:
            user_data.update({
                'employee_id': employee.employee_id,
                'employee_type': employee.level_of_work,
                'department': employee.department.name if employee.department else None,
                'designation': employee.designation.name if employee.designation else None,
            })
        
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': user_data
        })
        
    except Exception as e:
        return Response({
            'error': f'Login failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change password for both HR and employee users
    """
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if not old_password or not new_password or not confirm_password:
        return Response({
            'error': 'All password fields are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        return Response({
            'error': 'New passwords do not match'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({
            'error': 'New password must be at least 8 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = request.user
        
        # Check old password
        if not user.check_password(old_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Update password
        user.set_password(new_password)
        user.save()
        
        # Update generated password for HR users
        if user.role in ['hr_manager', 'hr_staff', 'department_head']:
            user.generated_password = new_password
            user.save()
        
        return Response({
            'message': 'Password changed successfully'
        })
        
    except Exception as e:
        return Response({
            'error': f'Password change failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    Refresh access token
    """
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response({
            'error': 'Refresh token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        
        return Response({
            'access': str(access_token)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Invalid refresh token'
        }, status=status.HTTP_401_UNAUTHORIZED)