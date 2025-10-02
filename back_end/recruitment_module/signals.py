from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Candidate, JobOpening


@receiver(post_save, sender=Candidate)
def update_job_opening_applications_count_on_candidate_save(sender, instance, created, **kwargs):
    """Update applications count when a candidate is created or updated"""
    if instance.job_opening:
        # Count all candidates for this job opening
        count = Candidate.objects.filter(job_opening=instance.job_opening).count()
        instance.job_opening.applications_count = count
        instance.job_opening.save(update_fields=['applications_count'])


@receiver(post_delete, sender=Candidate)
def update_job_opening_applications_count_on_candidate_delete(sender, instance, **kwargs):
    """Update applications count when a candidate is deleted"""
    if instance.job_opening:
        # Count all remaining candidates for this job opening
        count = Candidate.objects.filter(job_opening=instance.job_opening).count()
        instance.job_opening.applications_count = count
        instance.job_opening.save(update_fields=['applications_count'])
