from django.contrib.auth.models import AbstractUser

import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager  # Добавь BaseUserManager


class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # Убираем проверку username, так как его нет
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    username = None  # Убираем username
    name = models.CharField(max_length=48)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=13)
    balance = models.PositiveIntegerField(default=0)
    health_notes = models.CharField(max_length=255, blank=True)

    objects = MyUserManager()  # ПРИВЯЗЫВАЕМ НОВЫЙ МЕНЕДЖЕР

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']


class Category(models.Model):
    name = models.CharField(max_length=255)


class Item(models.Model):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    image = models.ImageField(upload_to='items/',null=True, blank=True)
    description = models.CharField(max_length=255)
    stock = models.PositiveIntegerField()
    contraindications = models.CharField(max_length=255)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)


class Transaction(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    sum = models.IntegerField()
    description = models.CharField(max_length=255)


class Payment(models.Model):
    class Status(models.TextChoices):
        waiting = ('waiting', "Ожидает")
        success = ('success', "Успех")
        error = ('error', "Ошибка")

    class Bank(models.TextChoices):
        TBank = ('TBank', "Тинькофф")
        VTB = ('VTB', "Втб")
        Sberbank = ('Sberbank', "Сбербанк")
        Alfa = ('Alfa', "Альфабанк")

    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    payment_status = models.CharField(choices=Status.choices, default=Status.waiting)
    transaction = models.ForeignKey('Transaction', on_delete=models.CASCADE)
    bank_choice = models.CharField(choices=Bank.choices, default=Bank.TBank)


class Order(models.Model):
    class Status(models.TextChoices):
        new = ('new', "Новый")
        payed = ('payed', "Оплачен")
        sended = ('sended', "Отправлен")
        delivered = ('delivered', "Доставлен")
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    status = models.CharField(choices=Status.choices, default=Status.new)
    total_price = models.IntegerField()


class OrderItem(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    item = models.ForeignKey("Item", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
