from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssetViewSet, 
    AssetAssignmentViewSet, 
    AssetMaintenanceViewSet, 
    AssetReturnViewSet
)

router = DefaultRouter()
router.register(r'assets', AssetViewSet)
router.register(r'assignments', AssetAssignmentViewSet)
router.register(r'maintenance', AssetMaintenanceViewSet)
router.register(r'returns', AssetReturnViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
