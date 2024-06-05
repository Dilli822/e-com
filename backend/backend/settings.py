"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-cgf48#y4t2i0g+j+!_p*@4oo#y9v7qc3+jil3-_ohc2nd$^$^m'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    
    'account',
    'masterDummy',
    # 'seller',
    # 'buyer',
    # 'products',
    # 'order',
        
    # 'django_extensions',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    # overrided middleware
    'corsheaders.middleware.CorsMiddleware',

]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# overrided settings starts here

AUTH_USER_MODEL = 'account.UserData'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}


CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",       
    "http://localhost:3000",
]


from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
  }

# settings.py

import os

# Email settings
# settings.py

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'f25836105@gmail.com'
EMAIL_HOST_PASSWORD = 'bvjo jzkz jzae qvkn'


# settings.py
from django.conf import settings
settings.TIME_ZONE = 'Asia/Kathmandu'

import os
from django.utils import timezone
import pytz
from logging import Formatter

import os
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from logging import Formatter

# Set the timezone directly in the formatter class
class PreciseTimezoneFormatter(Formatter):
    def formatTime(self, record, datefmt=None):
        tz = timezone.now().astimezone(pytz.timezone('Asia/Kathmandu')).strftime('%z')
        return f"{super().formatTime(record, datefmt)} {tz}"

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Define the path to the log directory
LOG_DIR = os.path.join(BASE_DIR, 'logs')

# Get the current year, month, and day
current_year = datetime.now().strftime('%Y')
current_month = datetime.now().strftime('%m')
current_day = datetime.now().strftime('%d')

# Ensure the log directory for the current year exists
year_log_dir = os.path.join(LOG_DIR, current_year)
os.makedirs(year_log_dir, exist_ok=True)

# Ensure the log directory for the current month exists
month_log_dir = os.path.join(year_log_dir, current_month)
os.makedirs(month_log_dir, exist_ok=True)

# Define the log file path format with current year, month, and day
LOG_FILE_FORMAT = os.path.join(month_log_dir, f"{current_year}-{current_month}-{current_day}.log")

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'precise_timezone': {
            '()': PreciseTimezoneFormatter,
            'format': '%(asctime)s [%(levelname)s] %(message)s',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': LOG_FILE_FORMAT,
            'when': 'midnight',  # Rotate logs daily
            'interval': 1,
            'backupCount': 7,  # Keep up to 7 days of logs
            'formatter': 'precise_timezone',  # Use the custom formatter
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'precise_timezone',  # Use the custom formatter
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}



from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

SSL_CERT_FILE = '/backend/cacert.pem'



import ssl
import certifi

# Create SSL context and load CA certs
context = ssl.create_default_context(cafile=certifi.where())

