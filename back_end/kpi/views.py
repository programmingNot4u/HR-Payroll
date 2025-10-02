from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Avg, Count, Max, Min
from django.db import transaction
from django.utils import timezone
from django.http import HttpResponse
from datetime import datetime, timedelta
import json
import csv
from io import StringIO

from .models import EmployeeKPI, KPITemplate, KPIAssessmentHistory
from .serializers import (
    EmployeeKPISerializer, EmployeeKPIListSerializer, KPITemplateSerializer,
    KPIAssessmentHistorySerializer, EmployeeWithKPISerializer, SkillMetricSerializer,
    KPIDashboardSerializer
)
from employees.models import Employee, Department, Designation, SkillMetric
from authentication.models import User


class KPIPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ActiveStaffEmployeesView(APIView):
    """
    API view for getting active staff employees for KPI management
    """
    permission_classes = [IsAuthenticated]
    pagination_class = KPIPagination
    
    def get(self, request):
        try:
            # Get query parameters
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            search = request.GET.get('search', '')
            department = request.GET.get('department', '')
            designation = request.GET.get('designation', '')
            year = request.GET.get('year', '')
            
            # Filter for active staff employees only
            queryset = Employee.objects.filter(
                status='active',
                level_of_work='staff'
            ).select_related('department', 'designation', 'user')
            
            # Apply search filter
            if search:
                queryset = queryset.filter(
                    Q(name_english__icontains=search) |
                    Q(employee_id__icontains=search) |
                    Q(email_address__icontains=search)
                )
            
            # Apply department filter
            if department:
                queryset = queryset.filter(department__name=department)
            
            # Apply designation filter
            if designation:
                queryset = queryset.filter(designation__name=designation)
            
            # Apply year filter - filter employees who have KPI records for the specified year
            if year:
                try:
                    year_int = int(year)
                    # Filter employees who have KPI records for the specified year
                    queryset = queryset.filter(
                        kpi_ratings__assessment_year=year_int
                    ).distinct()
                except ValueError:
                    # If year is not a valid integer, ignore the filter
                    pass
            
            # Order by name
            queryset = queryset.order_by('name_english')
            
            # Calculate pagination
            total_count = queryset.count()
            start = (page - 1) * page_size
            end = start + page_size
            
            employees = queryset[start:end]
            
            # Serialize employees
            employee_data = []
            for employee in employees:
                employee_data.append({
                    'id': employee.id,
                    'employee_id': employee.employee_id,
                    'full_name': employee.name_english,
                    'email': employee.email_address,
                    'phone': employee.mobile_number,
                    'department': employee.department.name if employee.department else '',
                    'designation': employee.designation.name if employee.designation else '',
                    'level_of_work': employee.level_of_work,
                    'status': employee.status,
                    'date_of_joining': employee.date_of_joining.isoformat() if employee.date_of_joining else None,
                    'profile_picture': employee.picture.url if employee.picture else None,
                })
            
            # Calculate pagination info
            total_pages = (total_count + page_size - 1) // page_size
            has_next = page < total_pages
            has_previous = page > 1
            
            return Response({
                'employees': employee_data,
                'pagination': {
                    'current_page': page,
                    'page_size': page_size,
                    'total_count': total_count,
                    'total_pages': total_pages,
                    'has_next': has_next,
                    'has_previous': has_previous,
                    'next_page': page + 1 if has_next else None,
                    'previous_page': page - 1 if has_previous else None,
                },
                'filters_applied': {
                    'search': search,
                    'department': department,
                    'designation': designation,
                    'year': year,
                }
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeKPIViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Employee KPI assessments
    """
    serializer_class = EmployeeKPISerializer
    permission_classes = [IsAuthenticated]
    pagination_class = KPIPagination
    
    def get_queryset(self):
        queryset = EmployeeKPI.objects.select_related(
            'employee', 'employee__department', 'employee__designation', 'assessed_by'
        ).all()
        
        # Filter by employee ID
        employee_id = self.request.query_params.get('employee_id')
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)
        
        # Filter by department
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(employee__department__name=department)
        
        # Filter by designation
        designation = self.request.query_params.get('designation')
        if designation:
            queryset = queryset.filter(employee__designation__name=designation)
        
        # Filter by year
        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(assessment_year=year)
        
        # Filter by month
        month = self.request.query_params.get('month')
        if month:
            queryset = queryset.filter(assessment_month=month)
        
        return queryset.order_by('-assessment_year', '-assessment_month', 'employee__name_english')
    
    def perform_create(self, serializer):
        print("=== KPI PERFORM CREATE DEBUG ===")
        print("Request data:", self.request.data)
        print("Serializer data:", serializer.validated_data)
        serializer.save(assessed_by=self.request.user)
    
    def perform_update(self, serializer):
        try:
            print("=== KPI PERFORM UPDATE DEBUG ===")
            print("Request data:", self.request.data)
            print("Serializer data:", serializer.validated_data)
            
            # Create history entry for updates
            old_instance = self.get_object()
            old_data = {
                'skill_ratings': old_instance.skill_ratings,
                'overall_score': float(old_instance.overall_score) if old_instance.overall_score is not None else None,
                'notes': old_instance.notes
            }
            
            print("Old data:", old_data)
            
            serializer.save()
            
            # Create history entry
            new_instance = serializer.instance
            new_data = {
                'skill_ratings': new_instance.skill_ratings,
                'overall_score': float(new_instance.overall_score) if new_instance.overall_score is not None else None,
                'notes': new_instance.notes
            }
            
            print("New data:", new_data)
            
            KPIAssessmentHistory.objects.create(
                kpi=new_instance,
                action='updated',
                old_value=json.dumps(old_data),
                new_value=json.dumps(new_data),
                changed_by=self.request.user
            )
            
            print("KPI update completed successfully")
        except Exception as e:
            print(f"Error in perform_update: {e}")
            import traceback
            traceback.print_exc()
            # Still save the update even if history creation fails
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def active_employees(self, request):
        """Get all active employees with their latest KPI data"""
        employees = Employee.objects.filter(
            status='active',
            level_of_work='staff'
        ).select_related('department', 'designation')
        
        serializer = EmployeeWithKPISerializer(employees, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_update_ratings(self, request):
        """Bulk update skill ratings for multiple employees"""
        try:
            updates = request.data.get('updates', [])
            updated_count = 0
            
            with transaction.atomic():
                for update in updates:
                    employee_id = update.get('employee_id')
                    skill_ratings = update.get('skill_ratings', {})
                    assessment_year = update.get('assessment_year', timezone.now().year)
                    assessment_month = update.get('assessment_month', timezone.now().month)
                    
                    if not employee_id or not skill_ratings:
                        continue
                    
                    # Get or create KPI record
                    kpi, created = EmployeeKPI.objects.get_or_create(
                        employee_id=employee_id,
                        assessment_year=assessment_year,
                        assessment_month=assessment_month,
                        defaults={
                            'skill_ratings': skill_ratings,
                            'assessed_by': request.user
                        }
                    )
                    
                    if not created:
                        # Update existing record
                        old_ratings = kpi.skill_ratings.copy()
                        kpi.skill_ratings = skill_ratings
                        kpi.assessed_by = request.user
                        kpi.save()
                        
                        # Create history entry
                        KPIAssessmentHistory.objects.create(
                            kpi=kpi,
                            action='bulk_updated',
                            old_value=json.dumps(old_ratings),
                            new_value=json.dumps(skill_ratings),
                            changed_by=request.user
                        )
                    else:
                        # Create history entry for new record
                        KPIAssessmentHistory.objects.create(
                            kpi=kpi,
                            action='created',
                            old_value='',
                            new_value=json.dumps(skill_ratings),
                            changed_by=request.user
                        )
                    
                    updated_count += 1
            
            return Response({
                'message': f'Successfully updated {updated_count} employee KPI records',
                'updated_count': updated_count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class KPITemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing KPI Templates
    """
    serializer_class = KPITemplateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return KPITemplate.objects.filter(is_active=True).order_by('name')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class KPIAssessmentHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing KPI Assessment History
    """
    serializer_class = KPIAssessmentHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return KPIAssessmentHistory.objects.select_related(
            'kpi', 'kpi__employee', 'changed_by'
        ).order_by('-changed_at')


class KPIDashboardView(APIView):
    """
    API view for KPI Dashboard statistics
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get current year and month
            current_year = timezone.now().year
            current_month = timezone.now().month
            
            # Total employees
            total_employees = Employee.objects.filter(status='active', level_of_work='staff').count()
            
            # Total assessments
            total_assessments = EmployeeKPI.objects.count()
            
            # Average score
            avg_score = EmployeeKPI.objects.aggregate(
                avg_score=Avg('overall_score')
            )['avg_score'] or 0.0
            
            # High performers (score >= 4.0)
            high_performers = EmployeeKPI.objects.filter(
                overall_score__gte=4.0
            ).values('employee').distinct().count()
            
            # Low performers (score < 2.5)
            low_performers = EmployeeKPI.objects.filter(
                overall_score__lt=2.5
            ).values('employee').distinct().count()
            
            # Department statistics
            dept_stats = {}
            departments = Department.objects.all()
            for dept in departments:
                dept_employees = Employee.objects.filter(
                    department=dept, status='active', level_of_work='staff'
                )
                dept_kpis = EmployeeKPI.objects.filter(
                    employee__department=dept
                ).aggregate(
                    avg_score=Avg('overall_score'),
                    total_assessments=Count('id')
                )
                
                dept_stats[dept.name] = {
                    'total_employees': dept_employees.count(),
                    'avg_score': dept_kpis['avg_score'] or 0.0,
                    'total_assessments': dept_kpis['total_assessments'] or 0
                }
            
            # Designation statistics
            designation_stats = {}
            designations = Designation.objects.all()
            for designation in designations:
                designation_employees = Employee.objects.filter(
                    designation=designation, status='active', level_of_work='staff'
                )
                designation_kpis = EmployeeKPI.objects.filter(
                    employee__designation=designation
                ).aggregate(
                    avg_score=Avg('overall_score'),
                    total_assessments=Count('id')
                )
                
                designation_stats[designation.name] = {
                    'total_employees': designation_employees.count(),
                    'avg_score': designation_kpis['avg_score'] or 0.0,
                    'total_assessments': designation_kpis['total_assessments'] or 0
                }
            
            # Monthly trends (last 12 months)
            monthly_trends = {}
            for i in range(12):
                month_date = timezone.now() - timedelta(days=30*i)
                year = month_date.year
                month = month_date.month
                
                month_kpis = EmployeeKPI.objects.filter(
                    assessment_year=year,
                    assessment_month=month
                ).aggregate(
                    avg_score=Avg('overall_score'),
                    total_assessments=Count('id')
                )
                
                monthly_trends[f"{year}-{month:02d}"] = {
                    'avg_score': month_kpis['avg_score'] or 0.0,
                    'total_assessments': month_kpis['total_assessments'] or 0
                }
            
            dashboard_data = {
                'total_employees': total_employees,
                'total_assessments': total_assessments,
                'average_score': round(avg_score, 1),
                'high_performers': high_performers,
                'low_performers': low_performers,
                'department_stats': dept_stats,
                'designation_stats': designation_stats,
                'monthly_trends': monthly_trends
            }
            
            serializer = KPIDashboardSerializer(dashboard_data)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class KPIStatisticsView(APIView):
    """
    API view for detailed KPI statistics
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get filter parameters
            department = request.query_params.get('department')
            designation = request.query_params.get('designation')
            year = request.query_params.get('year', timezone.now().year)
            
            # Build base queryset
            kpi_queryset = EmployeeKPI.objects.filter(assessment_year=year)
            
            if department:
                kpi_queryset = kpi_queryset.filter(employee__department__name=department)
            
            if designation:
                kpi_queryset = kpi_queryset.filter(employee__designation__name=designation)
            
            # Calculate statistics
            stats = kpi_queryset.aggregate(
                total_assessments=Count('id'),
                avg_score=Avg('overall_score'),
                max_score=Max('overall_score'),
                min_score=Min('overall_score')
            )
            
            # Score distribution
            score_distribution = {
                'excellent': kpi_queryset.filter(overall_score__gte=4.5).count(),
                'very_good': kpi_queryset.filter(overall_score__gte=4.0, overall_score__lt=4.5).count(),
                'good': kpi_queryset.filter(overall_score__gte=3.0, overall_score__lt=4.0).count(),
                'fair': kpi_queryset.filter(overall_score__gte=2.0, overall_score__lt=3.0).count(),
                'poor': kpi_queryset.filter(overall_score__lt=2.0).count(),
            }
            
            return Response({
                'statistics': stats,
                'score_distribution': score_distribution,
                'filters': {
                    'department': department,
                    'designation': designation,
                    'year': year
                }
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeKPIRatingsView(APIView):
    """
    API view for getting all KPI ratings for a specific employee
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
            kpis = EmployeeKPI.objects.filter(employee=employee).order_by(
                '-assessment_year', '-assessment_month'
            )
            
            serializer = EmployeeKPISerializer(kpis, many=True)
            return Response(serializer.data)
            
        except Employee.DoesNotExist:
            return Response({
                'error': 'Employee not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeLatestKPIView(APIView):
    """
    API view for getting the latest KPI for a specific employee
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
            latest_kpi = EmployeeKPI.objects.filter(employee=employee).order_by(
                '-assessment_year', '-assessment_month'
            ).first()
            
            if latest_kpi:
                serializer = EmployeeKPISerializer(latest_kpi)
                return Response(serializer.data)
            else:
                # Return empty KPI data instead of 404
                return Response({
                    'id': None,
                    'employee': employee_id,
                    'skill_ratings': {},
                    'overall_score': 0,
                    'assessment_year': None,
                    'assessment_month': None,
                    'notes': '',
                    'assessed_by': None,
                    'created_at': None,
                    'updated_at': None,
                    'message': 'No KPI data found for this employee'
                })
                
        except Employee.DoesNotExist:
            return Response({
                'error': 'Employee not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillMetricsView(APIView):
    """
    API view for getting all skill metrics
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            skill_metrics = SkillMetric.objects.filter(is_active=True)
            serializer = SkillMetricSerializer(skill_metrics, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SoftSkillsView(APIView):
    """
    API view for getting soft skills
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            soft_skills = SkillMetric.objects.filter(
                is_active=True,
                category='soft'
            )
            serializer = SkillMetricSerializer(soft_skills, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TechnicalSkillsView(APIView):
    """
    API view for getting technical skills
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            designation = request.query_params.get('designation')
            department = request.query_params.get('department')
            
            technical_skills = SkillMetric.objects.filter(
                is_active=True,
                category='technical'
            )
            
            if designation:
                technical_skills = technical_skills.filter(designation__name=designation)
            if department:
                technical_skills = technical_skills.filter(department__name=department)
            
            serializer = SkillMetricSerializer(technical_skills, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeSkillsView(APIView):
    """
    API view for getting skills for a specific employee
    Returns all soft skills + technical skills based on employee's designation
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, employee_id):
        try:
            # Get the employee
            try:
                employee = Employee.objects.get(id=employee_id)
            except Employee.DoesNotExist:
                return Response({
                    'error': 'Employee not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Get all soft skills (for all employees)
            soft_skills = SkillMetric.objects.filter(
                is_active=True,
                category='soft_skills'  # Using the correct category from the model
            )
            
            # Get technical skills based on employee's designation
            technical_skills = SkillMetric.objects.filter(
                is_active=True,
                category='technical'
            )
            
            # Filter technical skills by employee's designation if available
            if employee.designation:
                technical_skills = technical_skills.filter(
                    Q(designation__isnull=True) |  # Skills not specific to any designation
                    Q(designation=employee.designation.name)  # Skills for this specific designation
                )
            
            # Combine all skills
            all_skills = list(soft_skills) + list(technical_skills)
            
            # Serialize the skills
            serializer = SkillMetricSerializer(all_skills, many=True)
            
            return Response({
                'employee_id': employee.id,
                'employee_name': employee.name_english,
                'designation': employee.designation.name if employee.designation else None,
                'department': employee.department.name if employee.department else None,
                'skills': serializer.data,
                'soft_skills_count': soft_skills.count(),
                'technical_skills_count': technical_skills.count(),
                'total_skills_count': len(all_skills)
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BulkUpdateKPIsView(APIView):
    """
    API view for bulk updating KPI ratings
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            updates = request.data.get('updates', [])
            assessment_year = request.data.get('assessment_year', timezone.now().year)
            assessment_month = request.data.get('assessment_month', timezone.now().month)
            
            updated_count = 0
            
            with transaction.atomic():
                for update in updates:
                    employee_id = update.get('employee_id')
                    skill_ratings = update.get('skill_ratings', {})
                    
                    if not employee_id or not skill_ratings:
                        continue
                    
                    # Get or create KPI record
                    kpi, created = EmployeeKPI.objects.get_or_create(
                        employee_id=employee_id,
                        assessment_year=assessment_year,
                        assessment_month=assessment_month,
                        defaults={
                            'skill_ratings': skill_ratings,
                            'assessed_by': request.user
                        }
                    )
                    
                    if not created:
                        # Update existing record
                        old_ratings = kpi.skill_ratings.copy()
                        kpi.skill_ratings = skill_ratings
                        kpi.assessed_by = request.user
                        kpi.save()
                        
                        # Create history entry
                        KPIAssessmentHistory.objects.create(
                            kpi=kpi,
                            action='bulk_updated',
                            old_value=json.dumps(old_ratings),
                            new_value=json.dumps(skill_ratings),
                            changed_by=request.user
                        )
                    else:
                        # Create history entry for new record
                        KPIAssessmentHistory.objects.create(
                            kpi=kpi,
                            action='created',
                            old_value='',
                            new_value=json.dumps(skill_ratings),
                            changed_by=request.user
                        )
                    
                    updated_count += 1
            
            return Response({
                'message': f'Successfully updated {updated_count} employee KPI records',
                'updated_count': updated_count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class BulkCreateKPIsView(APIView):
    """
    API view for bulk creating KPI records
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            kpi_data = request.data.get('kpi_data', [])
            created_count = 0
            
            with transaction.atomic():
                for data in kpi_data:
                    employee_id = data.get('employee_id')
                    skill_ratings = data.get('skill_ratings', {})
                    assessment_year = data.get('assessment_year', timezone.now().year)
                    assessment_month = data.get('assessment_month', timezone.now().month)
                    notes = data.get('notes', '')
                    
                    if not employee_id:
                        continue
                    
                    # Create KPI record
                    kpi = EmployeeKPI.objects.create(
                        employee_id=employee_id,
                        skill_ratings=skill_ratings,
                        assessment_year=assessment_year,
                        assessment_month=assessment_month,
                        assessed_by=request.user,
                        notes=notes
                    )
                    
                    # Create history entry
                    KPIAssessmentHistory.objects.create(
                        kpi=kpi,
                        action='created',
                        old_value='',
                        new_value=json.dumps(skill_ratings),
                        changed_by=request.user
                    )
                    
                    created_count += 1
            
            return Response({
                'message': f'Successfully created {created_count} KPI records',
                'created_count': created_count
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ExportKPIsView(APIView):
    """
    API view for exporting KPI data to CSV
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get filter parameters
            department = request.query_params.get('department')
            designation = request.query_params.get('designation')
            year = request.query_params.get('year', timezone.now().year)
            
            # Build queryset
            kpis = EmployeeKPI.objects.select_related(
                'employee', 'employee__department', 'employee__designation'
            ).filter(assessment_year=year)
            
            if department:
                kpis = kpis.filter(employee__department__name=department)
            if designation:
                kpis = kpis.filter(employee__designation__name=designation)
            
            # Create CSV response
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="kpi_data_{year}.csv"'
            
            writer = csv.writer(response)
            
            # Write header
            writer.writerow([
                'Employee ID', 'Employee Name', 'Designation', 'Department',
                'Assessment Year', 'Assessment Month', 'Overall Score',
                'Skill Ratings', 'Assessed By', 'Notes', 'Created At'
            ])
            
            # Write data
            for kpi in kpis:
                writer.writerow([
                    kpi.employee.id,
                    kpi.employee.name_english or kpi.employee.name_bangla,
                    kpi.employee.designation.name if kpi.employee.designation else '',
                    kpi.employee.department.name if kpi.employee.department else '',
                    kpi.assessment_year,
                    kpi.assessment_month,
                    kpi.overall_score,
                    json.dumps(kpi.skill_ratings),
                    kpi.assessed_by.get_full_name() if kpi.assessed_by else '',
                    kpi.notes,
                    kpi.created_at.strftime('%Y-%m-%d %H:%M:%S')
                ])
            
            return response
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ImportKPIsView(APIView):
    """
    API view for importing KPI data from CSV
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            if 'file' not in request.FILES:
                return Response({
                    'error': 'No file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            file = request.FILES['file']
            if not file.name.endswith('.csv'):
                return Response({
                    'error': 'File must be a CSV'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Read CSV file
            csv_data = file.read().decode('utf-8')
            csv_reader = csv.DictReader(StringIO(csv_data))
            
            imported_count = 0
            errors = []
            
            with transaction.atomic():
                for row_num, row in enumerate(csv_reader, start=2):
                    try:
                        employee_id = row.get('Employee ID')
                        if not employee_id:
                            errors.append(f'Row {row_num}: Missing Employee ID')
                            continue
                        
                        # Parse skill ratings
                        skill_ratings = {}
                        if row.get('Skill Ratings'):
                            try:
                                skill_ratings = json.loads(row['Skill Ratings'])
                            except json.JSONDecodeError:
                                errors.append(f'Row {row_num}: Invalid skill ratings format')
                                continue
                        
                        # Create or update KPI record
                        kpi, created = EmployeeKPI.objects.get_or_create(
                            employee_id=employee_id,
                            assessment_year=int(row.get('Assessment Year', timezone.now().year)),
                            assessment_month=int(row.get('Assessment Month', timezone.now().month)),
                            defaults={
                                'skill_ratings': skill_ratings,
                                'assessed_by': request.user,
                                'notes': row.get('Notes', '')
                            }
                        )
                        
                        if not created:
                            kpi.skill_ratings = skill_ratings
                            kpi.assessed_by = request.user
                            kpi.notes = row.get('Notes', '')
                            kpi.save()
                        
                        # Create history entry
                        KPIAssessmentHistory.objects.create(
                            kpi=kpi,
                            action='imported',
                            old_value='',
                            new_value=json.dumps(skill_ratings),
                            changed_by=request.user
                        )
                        
                        imported_count += 1
                        
                    except Exception as e:
                        errors.append(f'Row {row_num}: {str(e)}')
                        continue
            
            return Response({
                'message': f'Successfully imported {imported_count} KPI records',
                'imported_count': imported_count,
                'errors': errors
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
