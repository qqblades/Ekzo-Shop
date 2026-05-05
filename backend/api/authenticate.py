from rest_framework.authentication import TokenAuthentication


class MyBearer(TokenAuthentication):
    keyword = 'Bearer'
