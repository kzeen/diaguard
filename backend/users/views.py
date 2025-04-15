from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import UserRegistrationSerializer, UserLoginSerializer

@api_view(['POST'])
def register(request):
    """
    API endpoint for user registration.
    Receives user details in the request data,
    validates them via UserRegistrationSerializer,
    creates a new user, and returns the user data along with an authentication token.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        response_data = serializer.data
        response_data['token'] = token.key
        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    """
    API endpoint for user login.
    Expects 'username' and 'password' in the request data.
    Authenticates the user and, if successful, returns an authentication token.
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
