from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from .models import JobOpening, Candidate, Application
from .serializers import (
    JobOpeningSerializer, JobOpeningListSerializer, JobOpeningCreateSerializer,
    CandidateSerializer, CandidateListSerializer, CandidateCreateSerializer, CandidateUpdateSerializer,
    ApplicationSerializer
)


class JobOpeningListCreateView(generics.ListCreateAPIView):
    """List and create job openings"""
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = JobOpening.objects.select_related('designation', 'department', 'created_by').all()
        
        # Add filtering
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
            
        designation = self.request.query_params.get('designation')
        if designation:
            queryset = queryset.filter(designation__name=designation)
            
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(designation__name__icontains=search)
            )
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobOpeningCreateSerializer
        return JobOpeningListSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create method to add better error handling"""
        try:
            print(f"Received job creation data: {request.data}")
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                print(f"Serializer is valid, creating job opening...")
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                print(f"Serializer validation errors: {serializer.errors}")
                return Response(
                    {'error': 'Validation failed', 'details': serializer.errors}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(f"Error creating job opening: {str(e)}")
            return Response(
                {'error': f'Failed to create job opening: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class JobOpeningDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a job opening"""
    
    permission_classes = [IsAuthenticated]
    queryset = JobOpening.objects.select_related('designation', 'department', 'created_by')
    serializer_class = JobOpeningSerializer


class CandidateListCreateView(generics.ListCreateAPIView):
    """List and create candidates"""
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Candidate.objects.select_related(
            'designation', 'department', 'job_opening', 'created_by'
        ).all()
        
        # Add filtering
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
            
        designation = self.request.query_params.get('designation')
        if designation:
            queryset = queryset.filter(designation__name=designation)
            
        job_id = self.request.query_params.get('job_id')
        if job_id:
            queryset = queryset.filter(job_opening__id=job_id)
            
        candidate_id = self.request.query_params.get('candidate_id')
        if candidate_id:
            queryset = queryset.filter(candidate_id__icontains=candidate_id)
            
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(email__icontains=search) |
                Q(designation__name__icontains=search)
            )
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CandidateCreateSerializer
        return CandidateListSerializer


class CandidateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a candidate"""
    
    permission_classes = [IsAuthenticated]
    queryset = Candidate.objects.select_related(
        'designation', 'department', 'job_opening', 'created_by'
    )
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CandidateUpdateSerializer
        return CandidateSerializer
    
    def update(self, request, *args, **kwargs):
        try:
            print(f"Received candidate update data: {request.data}")
            instance = self.get_object()
            print(f"Updating candidate: {instance.candidate_id}")
            
            serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
            if serializer.is_valid():
                print(f"Serializer is valid, updating candidate...")
                self.perform_update(serializer)
                return Response(serializer.data)
            else:
                print(f"Serializer validation errors: {serializer.errors}")
                return Response(
                    {'error': 'Validation failed', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(f"Error updating candidate: {str(e)}")
            return Response(
                {'error': f'Failed to update candidate: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_opening_statistics(request):
    """Get statistics for job openings"""
    try:
        total_openings = JobOpening.objects.count()
        active_openings = JobOpening.objects.filter(status='Active').count()
        on_hold_openings = JobOpening.objects.filter(status='On Hold').count()
        closed_openings = JobOpening.objects.filter(status='Closed').count()
        
        return Response({
            'total_openings': total_openings,
            'active_openings': active_openings,
            'on_hold_openings': on_hold_openings,
            'closed_openings': closed_openings
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_candidate_statistics(request):
    """Get statistics for candidates"""
    try:
        total_candidates = Candidate.objects.count()
        available_candidates = Candidate.objects.filter(
            Q(status='Applied') | Q(status='Shortlisted') | 
            Q(status='Interview Scheduled') | Q(status='Under Review') | 
            Q(status='Available')
        ).count()
        hired_candidates = Candidate.objects.filter(status='Hired').count()
        rejected_candidates = Candidate.objects.filter(
            Q(status='Did Not Qualify') | Q(status='Rejected')
        ).count()
        
        return Response({
            'total_candidates': total_candidates,
            'available_candidates': available_candidates,
            'hired_candidates': hired_candidates,
            'rejected_candidates': rejected_candidates
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_candidate_status(request, candidate_id):
    """Update candidate status"""
    try:
        candidate = Candidate.objects.get(id=candidate_id)
        new_status = request.data.get('status')
        
        if new_status not in [choice[0] for choice in Candidate.STATUS_CHOICES]:
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        candidate.status = new_status
        candidate.last_contact = timezone.now().date()
        candidate.save()
        
        serializer = CandidateSerializer(candidate)
        return Response(serializer.data)
        
    except Candidate.DoesNotExist:
        return Response(
            {'error': 'Candidate not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_job_opening_status(request, job_opening_id):
    """Update job opening status"""
    try:
        job_opening = JobOpening.objects.get(id=job_opening_id)
        new_status = request.data.get('status')
        
        if new_status not in [choice[0] for choice in JobOpening.STATUS_CHOICES]:
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job_opening.status = new_status
        job_opening.save()
        
        serializer = JobOpeningSerializer(job_opening)
        return Response(serializer.data)
        
    except JobOpening.DoesNotExist:
        return Response(
            {'error': 'Job opening not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recruitment_dashboard_data(request):
    """Get comprehensive recruitment dashboard data"""
    try:
        # Job opening statistics
        total_openings = JobOpening.objects.count()
        active_openings = JobOpening.objects.filter(status='Active').count()
        on_hold_openings = JobOpening.objects.filter(status='On Hold').count()
        closed_openings = JobOpening.objects.filter(status='Closed').count()
        
        # Candidate statistics
        total_candidates = Candidate.objects.count()
        available_candidates = Candidate.objects.filter(
            Q(status='Applied') | Q(status='Shortlisted') | 
            Q(status='Interview Scheduled') | Q(status='Under Review') | 
            Q(status='Available')
        ).count()
        hired_candidates = Candidate.objects.filter(status='Hired').count()
        rejected_candidates = Candidate.objects.filter(
            Q(status='Did Not Qualify') | Q(status='Rejected')
        ).count()
        
        # Recent activity
        recent_job_openings = JobOpening.objects.order_by('-created_at')[:5]
        recent_candidates = Candidate.objects.order_by('-created_at')[:5]
        
        return Response({
            'job_openings': {
                'total': total_openings,
                'active': active_openings,
                'on_hold': on_hold_openings,
                'closed': closed_openings
            },
            'candidates': {
                'total': total_candidates,
                'available': available_candidates,
                'hired': hired_candidates,
                'rejected': rejected_candidates
            },
            'recent_job_openings': JobOpeningListSerializer(recent_job_openings, many=True).data,
            'recent_candidates': CandidateListSerializer(recent_candidates, many=True).data
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)