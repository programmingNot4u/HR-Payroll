from django.urls import path
from . import views

urlpatterns = [
    # Job Opening URLs
    path('job-openings/', views.JobOpeningListCreateView.as_view(), name='job-opening-list-create'),
    path('job-openings/<int:pk>/', views.JobOpeningDetailView.as_view(), name='job-opening-detail'),
    path('job-openings/statistics/', views.get_job_opening_statistics, name='job-opening-statistics'),
    path('job-openings/<int:job_opening_id>/update-status/', views.update_job_opening_status, name='update-job-opening-status'),
    
    # Candidate URLs
    path('candidates/', views.CandidateListCreateView.as_view(), name='candidate-list-create'),
    path('candidates/<int:pk>/', views.CandidateDetailView.as_view(), name='candidate-detail'),
    path('candidates/statistics/', views.get_candidate_statistics, name='candidate-statistics'),
    path('candidates/<int:candidate_id>/update-status/', views.update_candidate_status, name='update-candidate-status'),
    
    # Dashboard URL
    path('dashboard/', views.get_recruitment_dashboard_data, name='recruitment-dashboard'),
]
