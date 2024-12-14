from django.db import models


# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(
        max_length=100, null=True, blank=True, default="Autor nieznany"
    )
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, default=1000.00
    )
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Theme(models.Model):
    primary_color = models.CharField(max_length=7, default="#3498db")  # niebieski
    secondary_color = models.CharField(max_length=7, default="#2ecc71")  # zielony
    accent_color = models.CharField(max_length=7, default="#e74c3c")  # czerwony

    def __str__(self):
        return f"Theme {self.id}"
