from rest_framework import serializers
from django.contrib.auth import get_user_model

# Gets the custom user model defined in AUTH_USER_MODEL in settings.py
User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new user.
    'password' field is write_only so it will not be returned in the response.
    """
    password = serializers.CharField(
    write_only=True,
    required=True,
    style={'input_type': 'password'},
    help_text="Enter a secure password."
    )

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'date_of_birth',
            'gender',
            'role',
            'address',
            'city',
            'state',
            'country',
            'postal_code',
        )
    
    def create(self, validated_data):
        """
        Create a new User instance with the validated data.
        Uses the create_user helper to handle password hashing.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            gender=validated_data.get('gender'),
            role=validated_data.get('role', User.PATIENT),
            address=validated_data.get('address', ''),
            city=validated_data.get('city', ''),
            state=validated_data.get('state', ''),
            country=validated_data.get('country', ''),
            postal_code=validated_data.get('postal_code', '')
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    - Takes a username and a password.
    - Does not map to a model because we only need to validate credentials.
    """
    username = serializers.CharField(
        required=True,
        help_text="Enter your username."
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Enter your password."
    )