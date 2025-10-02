from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, F, Count, Sum
from django.shortcuts import get_object_or_404

from .models import Asset, AssetAssignment, AssetMaintenance, AssetReturn
from .serializers import (
    AssetSerializer, AssetListSerializer, AssetCreateUpdateSerializer,
    AssetAssignmentSerializer, AssetAssignmentCreateSerializer,
    AssetMaintenanceSerializer, AssetMaintenanceCreateSerializer, AssetMaintenanceUpdateSerializer,
    AssetReturnSerializer, AssetReturnCreateSerializer
)


class AssetPagination(PageNumberPagination):
    """Custom pagination for assets"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class AssetViewSet(viewsets.ModelViewSet):
    """ViewSet for Asset CRUD operations"""
    
    queryset = Asset.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = AssetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'department']
    search_fields = ['id', 'name', 'model', 'assigned_to', 'assigned_to_id']
    ordering_fields = ['id', 'name', 'purchase_date', 'created_at']
    ordering = ['-updated_at']  # Show recently updated first
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action in ['list']:
            return AssetListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return AssetCreateUpdateSerializer
        return AssetSerializer
    
    def get_queryset(self):
        """Return queryset based on action"""
        if hasattr(self, 'action') and self.action == 'list':
            # Debug: Print query parameters
            print(f"Query params: {self.request.query_params}")
            return Asset.objects.all()
        return Asset.objects.prefetch_related('assignment_history', 'maintenance_history').all()
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available assets (not assigned)"""
        available_assets = Asset.objects.filter(status='Available')
        serializer = AssetListSerializer(available_assets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def choices(self, request):
        """Get all available choices for asset fields"""
        from .models import Asset, AssetAssignment, AssetMaintenance
        
        return Response({
            'categories': [choice[0] for choice in Asset.CATEGORY_CHOICES],
            'statuses': [choice[0] for choice in Asset.STATUS_CHOICES],
            'conditions': [choice[0] for choice in AssetAssignment.CONDITION_CHOICES],
            'maintenance_statuses': [choice[0] for choice in AssetMaintenance.STATUS_CHOICES],
        })
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get complete asset history including assignments, returns, and maintenance"""
        asset = self.get_object()
        
        # Get all assignments for this asset (including returned ones)
        assignments = AssetAssignment.objects.filter(asset=asset).order_by('assignment_date')
        assignment_data = []
        for assignment in assignments:
            assignment_data.append({
                'id': assignment.id,
                'employee_id': assignment.employee_id,
                'employee_name': assignment.employee_name,
                'assignment_date': assignment.assignment_date,
                'return_date': assignment.return_date,
                'assigned_condition': assignment.assigned_condition,
                'return_condition': assignment.return_condition,
                'assigned_by': assignment.assigned_by,
                'returned_by': assignment.returned_by,
                'assignment_reason': assignment.assignment_reason,
                'return_reason': assignment.return_reason,
                'assignment_notes': assignment.assignment_notes,
                'return_notes': assignment.return_notes,
                'is_active': assignment.is_active,
            })
        
        # Get all returns for this asset
        returns = AssetReturn.objects.filter(asset=asset.id).order_by('return_date')
        return_data = []
        for return_item in returns:
            return_data.append({
                'id': return_item.id,
                'employee_id': return_item.employee_id,
                'employee_name': return_item.employee_name,
                'assigned_date': return_item.assigned_date,
                'return_date': return_item.return_date,
                'return_condition': return_item.return_condition,
                'return_reason': return_item.return_reason,
                'received_by': return_item.received_by,
                'return_notes': return_item.return_notes,
            })
        
        # Get maintenance history for this asset
        maintenance = AssetMaintenance.objects.filter(asset=asset).order_by('scheduled_date')
        maintenance_data = []
        for maint in maintenance:
            maintenance_data.append({
                'id': maint.id,
                'scheduled_date': maint.scheduled_date,
                'completed_date': maint.completed_date,
                'maintenance_provider': maint.maintenance_provider,
                'status': maint.status,
                'description': maint.description,
                'cost': float(maint.cost) if maint.cost else None,
                'notes': maint.notes,
            })
        
        return Response({
            'asset': AssetListSerializer(asset).data,
            'assignments': assignment_data,
            'returns': return_data,
            'maintenance': maintenance_data,
        })
    
    @action(detail=False, methods=['get'])
    def assigned(self, request):
        """Get all assigned assets"""
        assigned_assets = Asset.objects.filter(status='Assigned')
        serializer = AssetListSerializer(assigned_assets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def maintenance(self, request):
        """Get all assets under maintenance"""
        maintenance_assets = Asset.objects.filter(status='Maintenance')
        serializer = AssetListSerializer(maintenance_assets, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign asset to employee"""
        asset = self.get_object()
        
        print(f"Assignment request for asset {pk}: {request.data}")
        
        if asset.status != 'Available':
            return Response(
                {'error': 'Asset is not available for assignment'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get employee data from request
        employee_id = request.data.get('employee_id')
        employee_name = request.data.get('employee_name')
        
        print(f"Employee ID: {employee_id}, Employee Name: {employee_name}")
        
        if not employee_id or not employee_name:
            return Response(
                {'error': 'Employee ID and name are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify employee exists by employee_id
        try:
            from employees.models import Employee
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {'error': f'Employee with ID {employee_id} not found'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create assignment data
        assignment_data = {
            'asset': asset.id,
            'employee_id': employee_id,
            'employee_name': employee_name,
            'assignment_date': request.data.get('assignment_date'),
            'expected_return_date': request.data.get('expected_return_date'),
            'assignment_reason': request.data.get('assignment_reason'),
            'assigned_by': request.data.get('assigned_by'),
            'assigned_condition': request.data.get('assigned_condition', 'Good'),
            'assignment_notes': request.data.get('assignment_notes')
        }
        
        print(f"Assignment data: {assignment_data}")
        
        serializer = AssetAssignmentCreateSerializer(data=assignment_data)
        print(f"Serializer is valid: {serializer.is_valid()}")
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        assignment = serializer.save()
        
        return Response(AssetAssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def unassign(self, request, pk=None):
        """Unassign asset from employee"""
        asset = self.get_object()
        
        if asset.status != 'Assigned':
            return Response(
                {'error': 'Asset is not currently assigned'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reset assignment data
        asset.status = 'Available'
        asset.assigned_to = 'Unassigned'
        asset.assigned_to_id = None
        asset.assignment_date = None
        asset.expected_return_date = None
        asset.assignment_reason = None
        asset.assigned_by = None
        asset.assignment_notes = None
        asset.assigned_condition = 'Good'
        asset.save()
        
        return Response({'message': 'Asset unassigned successfully'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def return_asset(self, request, pk=None):
        """Process asset return"""
        asset = self.get_object()
        
        if asset.status != 'Assigned':
            return Response(
                {'error': 'Asset is not currently assigned'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get return data from request
        return_data = {
            'asset': asset.id,
            'employee_id': asset.assigned_to_id,
            'employee_name': asset.assigned_to,
            'assigned_date': asset.assignment_date,
            'return_date': request.data.get('return_date'),
            'return_condition': request.data.get('return_condition'),
            'return_reason': request.data.get('return_reason'),
            'received_by': request.data.get('received_by'),
            'return_notes': request.data.get('return_notes')
        }
        
        serializer = AssetReturnCreateSerializer(data=return_data)
        if serializer.is_valid():
            return_record = serializer.save()
            return Response(AssetReturnSerializer(return_record).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get complete asset history including assignments, returns, and maintenance"""
        asset = self.get_object()
        
        # Get assignment history
        assignments = asset.assignment_history.all()
        assignment_serializer = AssetAssignmentSerializer(assignments, many=True)
        
        # Get maintenance history
        maintenance = asset.maintenance_history.all()
        maintenance_serializer = AssetMaintenanceSerializer(maintenance, many=True)
        
        return Response({
            'asset': AssetListSerializer(asset).data,
            'assignments': assignment_serializer.data,
            'maintenance': maintenance_serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def maintenance(self, request, pk=None):
        """Add maintenance record to asset"""
        asset = self.get_object()
        
        print(f"Received maintenance request for asset {asset.id}")
        print(f"Request data: {request.data}")
        
        maintenance_data = {
            'asset': asset.id,
            'scheduled_date': request.data.get('scheduled_date'),
            'completed_date': request.data.get('completed_date'),
            'maintenance_provider': request.data.get('maintenance_provider'),
            'status': request.data.get('status', 'Pending'),
            'description': request.data.get('description'),
            'cost': request.data.get('cost'),
            'notes': request.data.get('notes')
        }
        
        print(f"Processed maintenance data: {maintenance_data}")
        
        serializer = AssetMaintenanceCreateSerializer(data=maintenance_data)
        if serializer.is_valid():
            maintenance = serializer.save()
            print(f"Maintenance record created successfully: {maintenance.id}")
            return Response(AssetMaintenanceSerializer(maintenance).data, status=status.HTTP_201_CREATED)
        else:
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def maintenance_history(self, request):
        """Get all maintenance history"""
        maintenance_records = AssetMaintenance.objects.select_related('asset').all()
        serializer = AssetMaintenanceSerializer(maintenance_records, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def maintenance_due(self, request):
        """Get assets that need maintenance"""
        assets_due = Asset.objects.filter(need_maintenance=True, status='Available')
        serializer = AssetListSerializer(assets_due, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search assets by ID or name"""
        query = request.query_params.get('q', '').strip()
        
        if not query:
            return Response([])
        
        # Parse combined search terms like "002 - iphone"
        search_terms = []
        
        # Check if it's in the format "ID - Name"
        if ' - ' in query:
            parts = query.split(' - ', 1)
            if len(parts) == 2:
                id_part = parts[0].strip()
                name_part = parts[1].strip()
                # Add both individual terms and the full query
                search_terms.extend([id_part, name_part, query])
        else:
            search_terms.append(query)
        
        # Build search query - use OR logic for combined terms
        search_query = Q()
        for term in search_terms:
            if term:
                search_query |= Q(id__icontains=term) | Q(name__icontains=term)
        
        # Search by asset ID or name (case-insensitive)
        assets = Asset.objects.filter(search_query)[:10]  # Limit to 10 results for performance
        
        serializer = AssetListSerializer(assets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get asset statistics for dashboard"""
        # Get basic counts by status
        status_counts = Asset.objects.values('status').annotate(count=Count('id'))
        
        # Get total counts
        total_assets = Asset.objects.count()
        total_value = Asset.objects.aggregate(total=Sum('value'))['total'] or 0
        
        # Get counts by category
        category_counts = Asset.objects.values('category').annotate(count=Count('id'))
        
        # Get counts by department
        department_counts = Asset.objects.values('department').annotate(count=Count('id'))
        
        # Calculate book values (simplified - would need depreciation calculation)
        available_assets = Asset.objects.filter(status='Available').count()
        assigned_assets = Asset.objects.filter(status='Assigned').count()
        lost_assets = Asset.objects.filter(status='Lost').count()
        damaged_assets = Asset.objects.filter(status='Damaged').count()
        maintenance_assets = Asset.objects.filter(status='Maintenance').count()
        
        # Calculate values by status
        available_value = Asset.objects.filter(status='Available').aggregate(total=Sum('value'))['total'] or 0
        assigned_value = Asset.objects.filter(status='Assigned').aggregate(total=Sum('value'))['total'] or 0
        lost_value = Asset.objects.filter(status='Lost').aggregate(total=Sum('value'))['total'] or 0
        damaged_value = Asset.objects.filter(status='Damaged').aggregate(total=Sum('value'))['total'] or 0
        maintenance_value = Asset.objects.filter(status='Maintenance').aggregate(total=Sum('value'))['total'] or 0
        
        return Response({
            'total_assets': total_assets,
            'total_value': total_value,
            'status_counts': {
                'available': available_assets,
                'assigned': assigned_assets,
                'lost': lost_assets,
                'damaged': damaged_assets,
                'maintenance': maintenance_assets,
            },
            'status_values': {
                'available': available_value,
                'assigned': assigned_value,
                'lost': lost_value,
                'damaged': damaged_value,
                'maintenance': maintenance_value,
            },
            'category_counts': list(category_counts),
            'department_counts': list(department_counts),
        })


class AssetAssignmentViewSet(viewsets.ModelViewSet):
    """ViewSet for AssetAssignment operations"""
    
    queryset = AssetAssignment.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['employee_id', 'asset__status']
    search_fields = ['employee_name', 'asset__name', 'asset__id']
    ordering_fields = ['assignment_date', 'created_at']
    ordering = ['-assignment_date']
    
    def get_serializer_class(self):
        if self.action in ['create']:
            return AssetAssignmentCreateSerializer
        return AssetAssignmentSerializer
    
    def get_queryset(self):
        # Only return active assignments (those without return_date)
        return AssetAssignment.objects.select_related('asset').filter(return_date__isnull=True)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active assignments"""
        active_assignments = AssetAssignment.objects.filter(return_date__isnull=True)
        serializer = AssetAssignmentSerializer(active_assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_employee(self, request):
        """Get assignments by employee ID"""
        employee_id = request.query_params.get('employee_id')
        if not employee_id:
            return Response(
                {'error': 'Employee ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assignments = AssetAssignment.objects.filter(employee_id=employee_id)
        serializer = AssetAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)


class AssetMaintenanceViewSet(viewsets.ModelViewSet):
    """ViewSet for AssetMaintenance operations"""
    
    queryset = AssetMaintenance.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'asset__category']
    search_fields = ['maintenance_provider', 'asset__name', 'asset__id']
    ordering_fields = ['scheduled_date', 'completed_date', 'created_at']
    ordering = ['-scheduled_date']
    
    def get_serializer_class(self):
        if self.action in ['create']:
            return AssetMaintenanceCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AssetMaintenanceUpdateSerializer
        return AssetMaintenanceSerializer
    
    def update(self, request, *args, **kwargs):
        print(f"Update maintenance request: {request.data}")
        print(f"Using serializer: {self.get_serializer_class()}")
        return super().update(request, *args, **kwargs)
    
    def get_queryset(self):
        return AssetMaintenance.objects.select_related('asset').all()
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending maintenance"""
        pending_maintenance = AssetMaintenance.objects.filter(status='Pending')
        serializer = AssetMaintenanceSerializer(pending_maintenance, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get all completed maintenance"""
        completed_maintenance = AssetMaintenance.objects.filter(status='Complete')
        serializer = AssetMaintenanceSerializer(completed_maintenance, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark maintenance as complete"""
        maintenance = self.get_object()
        
        completed_date = request.data.get('completed_date')
        if not completed_date:
            return Response(
                {'error': 'Completed date is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        maintenance.status = 'Complete'
        maintenance.completed_date = completed_date
        maintenance.save()
        
        # Update asset status to Available
        asset = maintenance.asset
        asset.status = 'Available'
        asset.save()
        
        return Response(AssetMaintenanceSerializer(maintenance).data, status=status.HTTP_200_OK)


class AssetReturnViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for AssetReturn operations (read-only)"""
    
    queryset = AssetReturn.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['employee_id', 'return_condition']
    search_fields = ['employee_name', 'asset__name', 'asset__id']
    ordering_fields = ['return_date', 'created_at']
    ordering = ['-return_date']
    
    def get_serializer_class(self):
        return AssetReturnSerializer
    
    def get_queryset(self):
        return AssetReturn.objects.select_related('asset').all()
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent returns (last 30 days)"""
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        recent_returns = AssetReturn.objects.filter(
            return_date__gte=thirty_days_ago
        ).order_by('-return_date')
        
        serializer = AssetReturnSerializer(recent_returns, many=True)
        return Response(serializer.data)