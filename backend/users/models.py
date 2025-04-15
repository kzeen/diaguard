from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    """
    Custom User model that extends Django's AbstractUser model with additional fields.
    """

    date_of_birth = models.DateField(
        blank=True,
        null=True,
        help_text=_("Optional. Format: YYYY-MM-DD")
    )

    MALE = 'M'
    FEMALE = 'F'
    GENDER_CHOICES = [
        (MALE, _('Male')),
        (FEMALE, _('Female')),
    ]
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True,
        null=True,
        help_text=_("Optional. Select the user's gender.")
    )

    PATIENT = 'patient'
    CLINICIAN = 'clinician'
    ADMIN = 'admin'
    ROLE_CHOICES = [
        (PATIENT, _('Patient')),
        (CLINICIAN, _('Clinician')),
        (ADMIN, _('Admin')),
    ]
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=PATIENT,
        help_text=_("Defines the user's role in the platform.")
    )

    address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text=_("Optional. User's street address.")
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text=_("Optional. City.")
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text=_("Optional. State or region.")
    )

    country = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text=_("Optional. Country.")
    )

    postal_code = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text=_("Optional. Postal or ZIP code.")
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
