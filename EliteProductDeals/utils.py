import random
import string
from django.core.mail import send_mail
from django.conf import settings


def generate_random_password(min_length, max_length):
    length = random.randint(min_length, max_length)
    letters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(letters) for i in range(length))


def send_password_reset_email(email, new_password):
    subject = 'Your new password'
    message = f'Your new password is: {new_password}'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)