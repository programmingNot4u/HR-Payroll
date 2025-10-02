from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import RegexValidator
import secrets
import string

class UserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
            
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('hr_manager', 'HR Manager'),
        ('hr_staff', 'HR Staff'),
        ('department_head', 'Department Head'),
        ('employee', 'Employee'),
    ]
    
    # Remove username field and use email as unique identifier
    username = None
    email = models.EmailField(unique=True)
    
    # Custom fields
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='employee',
        help_text="User's role in the system"
    )
    phone = models.CharField(
        max_length=20, 
        blank=True,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )]
    )
    generated_password = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        help_text="Generated password for HR users (stored in plain text for sharing)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user should be treated as active."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    # Assign the custom manager
    objects = UserManager()

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.email}"
    
    @property
    def full_name(self):
        """Return the full name of the user"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def is_hr_staff(self):
        return self.role in ['hr_manager', 'hr_staff', 'super_admin']
    
    def is_management(self):
        return self.role in ['hr_manager', 'department_head', 'super_admin']
    
    @staticmethod
    def generate_employee_credentials(employee_id, phone_number):
        """
        Generate credentials for employee login
        For employees: Use phone number + employee ID (no password needed)
        """
        # Generate unique ID (4 random characters)
        unique_id = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4))
        
        # Create email
        email = f"{employee_id}{unique_id}@company.com"
        
        # For employees, we don't need a password - they use phone + employee_id
        password = None
        
        return email, password
    
    @staticmethod
    def generate_hr_credentials(email, role):
        """
        Generate strong password for HR users
        """
        # Generate strong password (12 characters with mixed case, numbers, symbols)
        password_chars = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(password_chars) for _ in range(12))
        
        return password