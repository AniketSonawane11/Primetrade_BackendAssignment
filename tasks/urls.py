from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from django.urls import path, include

app_name = "tasks"
router = DefaultRouter()
router.register("", TaskViewSet, basename="task")

urlpatterns = [
    path("", include(router.urls)),
]
