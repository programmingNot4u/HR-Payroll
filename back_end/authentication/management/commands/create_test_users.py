from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from employees.models import Employee, Department, Designation, SalaryGrade
import secrets
import string

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test HR and Employee users with generated credentials'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset existing test users',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Resetting existing test users...')
            User.objects.filter(email__startswith='test_').delete()
            Employee.objects.filter(user__email__startswith='test_').delete()

        # Create test HR user
        hr_user = self.create_hr_user()
        
        # Create test employee
        employee_user = self.create_employee_user()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created test users!')
        )
        self.stdout.write('\n=== TEST CREDENTIALS ===')
        self.stdout.write(f'HR Manager Login:')
        self.stdout.write(f'  Employee Portal: Employee ID + Password')
        self.stdout.write(f'  HR Admin Portal: Email/Phone + Password')
        self.stdout.write(f'  Email: {hr_user.email}')
        self.stdout.write(f'  Phone: {hr_user.phone}')
        self.stdout.write(f'  Password: {hr_user.raw_password}')
        self.stdout.write(f'\nEmployee Login:')
        self.stdout.write(f'  Employee Portal: Employee ID + Password')
        self.stdout.write(f'  Employee ID: {employee.employee_id}')
        self.stdout.write(f'  Password: {hr_user.raw_password}')  # Same generated password
        self.stdout.write('\n=== END CREDENTIALS ===')

    def create_hr_user(self):
        """Create a test HR user"""
        email = 'test_hr@hrpayroll.com'
        password = self.generate_password()
        
        # Create or update HR user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': 'Test',
                'last_name': 'HR Manager',
                'phone': '+1234567890',
                'role': 'hr_manager',
                'is_active': True,
            }
        )
        
        if not created:
            user.first_name = 'Test'
            user.last_name = 'HR Manager'
            user.phone = '+1234567890'
            user.role = 'hr_manager'
            user.is_active = True
            user.save()
        
        # Set password
        user.set_password(password)
        user.save()
        
        # Store raw password for display
        user.raw_password = password
        
        self.stdout.write(f'Created HR user: {email}')
        return user

    def create_employee_user(self):
        """Create a test employee user"""
        phone = '+1987654321'
        employee_id = 'EMP999'
        
        # Create or get department
        department, _ = Department.objects.get_or_create(
            name='IT Department',
            defaults={'description': 'Information Technology Department'}
        )
        
        # Create or get designation
        designation, _ = Designation.objects.get_or_create(
            name='Software Developer',
            department=department,
            defaults={'description': 'Software Development Role'}
        )
        
        # Create or get salary grade
        salary_grade, _ = SalaryGrade.objects.get_or_create(
            name='Grade 3',
            defaults={
                'grade_type': 'staff',
                'basic_salary': 50000,
                'house_rent': 10000,
                'medical_allowance': 5000,
                'conveyance': 3000,
                'food_allowance': 2000,
                'mobile_bill': 1000,
                'gross_salary': 71000,
            }
        )
        
        # Create or update employee user
        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={
                'email': f'test_employee_{employee_id.lower()}@hrpayroll.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'employee',
                'is_active': True,
            }
        )
        
        if not created:
            user.email = f'test_employee_{employee_id.lower()}@hrpayroll.com'
            user.first_name = 'John'
            user.last_name = 'Doe'
            user.role = 'employee'
            user.is_active = True
            user.save()
        
        # Create or update employee record
        employee, emp_created = Employee.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': employee_id,
                'name_english': 'John Doe',
                'name_bangla': 'জন ডো',
                'mobile_number': phone,
                'department': department,
                'designation': designation,
                'salary_grade': salary_grade,
                'level_of_work': 'permanent',
                'gross_salary': 60000,
                'status': 'active',
            }
        )
        
        if not emp_created:
            employee.employee_id = employee_id
            employee.name_english = 'John Doe'
            employee.name_bangla = 'জন ডো'
            employee.mobile_number = phone
            employee.department = department
            employee.designation = designation
            employee.salary_grade = salary_grade
            employee.level_of_work = 'permanent'
            employee.gross_salary = 60000
            employee.status = 'active'
            employee.save()
        
        self.stdout.write(f'Created Employee user: {phone} (ID: {employee_id})')
        return user

    def generate_password(self, length=12):
        """Generate a random password"""
        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(characters) for _ in range(length))
        return password
