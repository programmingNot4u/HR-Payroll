from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from employees.models import Employee

User = get_user_model()

@receiver(post_save, sender=User)
def create_employee_profile(sender, instance, created, **kwargs):
    """
    Automatically create employee profile when user is created
    This is optional - you might want to create employees manually
    """
    if created and instance.role == 'employee':
        # You'll need to set default department and designation
        # For now, we'll leave this empty and create employees manually
        pass