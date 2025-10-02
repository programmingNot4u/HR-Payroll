from django.apps import AppConfig


class AttendanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'attendance'
    verbose_name = 'Attendance Management'
    
    def ready(self):
        """Initialize the attendance system when Django starts"""
        import attendance.signals