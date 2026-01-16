# accounts/utils/responses.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

def success_response(message, data=None, status_code=status.HTTP_200_OK):
    """
    Standardized success API response.
    """
    return Response({
        'status': 'success',
        'message': message,
        'data': data
    }, status=status_code)

def error_response(message, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Standardized error API response.
    """
    return Response({
        'status': 'error',
        'message': message,
        'errors': errors
    }, status=status_code)

def get_tokens_for_user(user):
    """
    Generates access and refresh tokens for a given user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

