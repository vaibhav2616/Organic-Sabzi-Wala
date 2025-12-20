from rest_framework import viewsets, permissions
from .models import Address
from .serializers import AddressSerializer
from .renderers import StandardResponseRenderer

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    renderer_classes = [StandardResponseRenderer]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
