from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Subscription
from .serializers import SubscriptionSerializer
from django.utils import timezone
import datetime

class SubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Auto-calculate next_delivery_date based on start_date
        start_date = serializer.validated_data.get('start_date')
        if not start_date:
            start_date = timezone.now().date()
            
        serializer.save(user=self.request.user, next_delivery_date=start_date)

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        sub = self.get_object()
        sub.status = 'PAUSED'
        sub.save()
        return Response({'status': 'Subscription paused'})

    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        sub = self.get_object()
        sub.status = 'ACTIVE'
        # Logic to reset next_delivery_date could go here
        sub.save()
        return Response({'status': 'Subscription resumed'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        sub = self.get_object()
        sub.status = 'CANCELLED'
        sub.save()
        return Response({'status': 'Subscription cancelled'})
