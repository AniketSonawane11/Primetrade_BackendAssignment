from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from accounts.permissions import IsAdminOrOwner

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user

        if getattr(self, "swagger_fake_view", False):
            return Task.objects.none()

        if user.is_admin:
            return Task.objects.all()

        return Task.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
