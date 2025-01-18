from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(
        max_length=100, null=True, blank=True, default="Autor nieznany"
    )
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, default=1000.00
    )
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(
        "Category",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="books",
    )
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Category(models.Model):
    name = models.CharField(max_length=255)
    moderators = models.ManyToManyField(
        User,
        limit_choices_to={"userprofile__is_moderator": True},
        related_name="moderated_categories",
        blank=True,
    )

    def __str__(self):
        return self.name


class Comment(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(null=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.book.title}"

    @property
    def category(self):
        return self.book.category


class Event(models.Model):
    ACTIONS = [
        ("COMMENT_APPROVED", "Comment Approved"),
        ("COMMENT_REJECTED", "Comment Rejected"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50, choices=ACTIONS)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"


class Theme(models.Model):
    name = models.CharField(max_length=100)
    primary_color = models.CharField(max_length=7, default="#3498db")  # niebieski
    secondary_color = models.CharField(max_length=7, default="#2ecc71")  # zielony
    accent_color = models.CharField(max_length=7, default="#e74c3c")  # czerwony

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    selected_theme = models.ForeignKey(
        "Theme", on_delete=models.SET_NULL, null=True, blank=True
    )
    is_admin = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class GalleryImage(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to="gallery/")

    def __str__(self):
        return self.title


class Slider(models.Model):
    title = models.CharField(max_length=255)
    images = models.ManyToManyField(GalleryImage, related_name="sliders", blank=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Oczekujące"),
        ("shipped", "Wysłane"),
        ("delivered", "Dostarczone"),
        ("cancelled", "Anulowane"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shipping_address = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    city = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"Zamówienie {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Produkt: {self.book.title}, Ilość: {self.quantity}"
