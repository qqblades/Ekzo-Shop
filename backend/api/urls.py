from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ItemViewSet, CategoryViewSet, UserProfileViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='items')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    # Убираем 'api/', так как он уже есть в главном urls.py
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
