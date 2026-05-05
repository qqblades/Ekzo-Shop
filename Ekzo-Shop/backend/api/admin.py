from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe
from .models import User, Category, Item, Order, OrderItem, Transaction, Payment


# 1. Настройка админки пользователя (без username, вход по email)
@admin.register(User)
class MyUserAdmin(UserAdmin):
    list_display = ('email', 'name', 'phone', 'balance', 'is_staff')
    search_fields = ('email', 'name', 'phone')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    ordering = ('email',)

    # Поля в карточке пользователя
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Личные данные', {'fields': ('name', 'phone', 'balance', 'health_notes')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Даты', {'fields': ('last_login', 'date_joined')}),
    )
    # Поля при создании нового пользователя через админку
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone', 'balance', 'password'),
        }),
    )


# 2. Настройка товаров с превью картинок
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('get_image', 'name', 'price', 'stock', 'category')
    list_display_links = ('get_image', 'name')  # Клик по фото тоже открывает товар
    list_filter = ('category',)
    search_fields = ('name', 'description')
    readonly_fields = ('preview_image',)  # Поле только для чтения в карточке

    def get_image(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" width="50" height="50" style="object-fit:cover; border-radius:8px;">')
        return "Нет фото"

    get_image.short_description = "Фото"

    def preview_image(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="200" style="border-radius:15px;">')
        return "Фото еще не загружено"

    preview_image.short_description = "Предпросмотр"


# 3. Инлайн для товаров внутри заказа
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('item', 'quantity')


# 4. Настройка заказов
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price')
    list_filter = ('status',)
    search_fields = ('user__email', 'user__name')
    inlines = [OrderItemInline]


# 5. Категории
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# 6. Платежи и транзакции
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'payment_status', 'bank_choice')
    list_filter = ('payment_status', 'bank_choice')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'sum', 'description')
