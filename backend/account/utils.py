import secrets
from django.shortcuts import render
from django.core.mail import send_mail
from django.http import JsonResponse
from .models import UserDetails, UserData
from django.utils import timezone
from datetime import timedelta

def generate_random_token(length=16):
    # Generate a random token with the specified length
    return secrets.token_urlsafe(length)

def send_email_view(request, email):
    # Generate a random token for password reset link
    token = generate_random_token()

    # Construct the password reset link
    reset_link = f'http://localhost:3000/e-com/reset-password/{token}'

    # Save the token in the database and set its expiration time
    try:
        user_data = UserData.objects.get(email=email)  # Retrieve the UserData instance
        user_details, _ = UserDetails.objects.get_or_create(user=user_data)  # Associate UserData with UserDetails
        user_details.password_reset_token = token
        user_details.password_reset_token_generated_time = timezone.now()
        user_details.password_reset_token_expire = timezone.now() + timedelta(minutes=5)
        user_details.save()
    except UserData.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    # Compose email message
    subject = 'Password Reset Link From E-com'
    message = f'Token will expire in 5 minutes. Click on the link to reset the password: {reset_link}'
    from_email = 'testingbot202424@gmail.com'
    recipient_list = [email]

    # Send the email
    send_mail(subject, message, from_email, recipient_list)

    return JsonResponse({'message': 'Password reset email sent successfully.'})
