from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import viewsets, status, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Category, Item, Order, OrderItem
from .serializers import (
    RegisterSerializer, ItemSerializer, CategorySerializer,
    UserSerializer, OrderSerializer
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class UserProfileViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def buy(self, request):
        item_id = request.data.get('item_id')
        if not item_id:
            return Response({"detail": "Не указан ID товара"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({"detail": "Товар не найден"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if user.balance < item.price:
            return Response({"detail": "Недостаточно средств на балансе!"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            item.stock -= 1
            item.save()
            user.balance -= item.price
            user.save()

            order = Order.objects.create(
                user=user,
                status='payed',
                total_price=item.price
            )

            OrderItem.objects.create(
                order=order,
                item=item,
                quantity=1
            )

        return Response({
            "message": f"Вы успешно купили {item.name}",
            "new_balance": user.balance
        }, status=status.HTTP_200_OK)
