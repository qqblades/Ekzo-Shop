from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Category, Item, Transaction, Payment, OrderItem, Order

User = get_user_model()


# Сериализатор пользователя для фронтенда (баланс, имя)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'balance', 'phone']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    conf_password = serializers.CharField(required=True, write_only=True)
    phone = serializers.CharField(required=True)
    health_notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['conf_password']:
            # ВАЖНО: нужно вызывать raise, а не return
            raise serializers.ValidationError({"detail": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('conf_password')
        return User.objects.create_user(**validated_data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ItemSerializer(serializers.ModelSerializer):
    # Добавим отображение категории строкой для фронтенда
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ['id']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_price']
        read_only_fields = ['id', 'user']  # Юзер берется из запроса


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'item', 'quantity', 'created_at']
        read_only_fields = ['id', 'created_at']


# Если нужны транзакции и платежи (для расширения логики)
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'sum', 'description']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_status', 'transaction', 'bank_choice']
