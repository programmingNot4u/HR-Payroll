from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import AttendanceScan, DailyAttendance, LeaveRequest, LeaveBalance


@receiver(post_save, sender=AttendanceScan)
def attendance_scan_created(sender, instance, created, **kwargs):
    """Handle new attendance scan creation"""
    if created:
        # Update daily attendance record
        try:
            daily_attendance, created = DailyAttendance.objects.get_or_create(
                employee=instance.employee,
                date=instance.scan_time.date(),
                defaults={'status': 'Absent'}
            )
            
            # Update scan counts
            daily_attendance.total_scans += 1
            
            if instance.scan_type in ['IN', 'BREAK_OUT', 'OVERTIME_IN']:
                daily_attendance.check_in_count += 1
                if not daily_attendance.first_check_in:
                    daily_attendance.first_check_in = instance.scan_time.time()
            elif instance.scan_type in ['OUT', 'BREAK_IN', 'OVERTIME_OUT']:
                daily_attendance.check_out_count += 1
                daily_attendance.last_check_out = instance.scan_time.time()
            
            # Recalculate working hours and overtime
            if daily_attendance.first_check_in and daily_attendance.last_check_out:
                daily_attendance.total_working_hours = daily_attendance.calculate_working_hours()
                daily_attendance.overtime_hours = daily_attendance.calculate_overtime()
                daily_attendance.extra_overtime_hours = daily_attendance.calculate_extra_overtime()
                
                # Update eligibility flags
                daily_attendance.snacks_eligible = daily_attendance.extra_overtime_hours >= 1.0
                daily_attendance.night_bill_eligible = daily_attendance.extra_overtime_hours >= 5.0
                
                # Update status
                if daily_attendance.first_check_in <= timezone.now().time().replace(hour=8, minute=0):
                    daily_attendance.status = 'Present-OnTime'
                elif daily_attendance.first_check_in <= timezone.now().time().replace(hour=8, minute=5):
                    daily_attendance.status = 'Present-Considered'
                else:
                    daily_attendance.status = 'Present-Late'
            
            daily_attendance.save()
            
        except Exception as e:
            print(f"Error updating daily attendance: {str(e)}")


@receiver(post_save, sender=LeaveRequest)
def leave_request_status_changed(sender, instance, created, **kwargs):
    """Handle leave request status changes"""
    if not created and instance.status == 'approved':
        # Update leave balance when request is approved
        try:
            balance, created = LeaveBalance.objects.get_or_create(
                employee=instance.employee,
                leave_policy=instance.leave_policy,
                year=instance.start_date.year,
                defaults={
                    'total_days': instance.leave_policy.max_days_per_year,
                    'used_days': 0,
                    'carried_forward': 0
                }
            )
            
            if not created:
                balance.used_days += instance.total_days
                balance.save()
                
        except Exception as e:
            print(f"Error updating leave balance: {str(e)}")


@receiver(post_save, sender=LeaveBalance)
def leave_balance_updated(sender, instance, created, **kwargs):
    """Handle leave balance updates"""
    # Recalculate available days
    instance.available_days = instance.total_days + instance.carried_forward - instance.used_days
    if instance.available_days != instance.available_days:  # Check if calculation changed
        instance.save(update_fields=['available_days'])
