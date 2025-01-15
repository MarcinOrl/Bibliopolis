from django.contrib import admin
from .models import (
    Book,
    Category,
    ModeratorCategory,
    Comment,
    EventLog,
    Theme,
    GalleryImage,
    Slider,
    UserProfile,
    Order,
    OrderItem,
    Event,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "is_admin", "is_moderator")
    list_filter = ("is_admin", "is_moderator")
    search_fields = ("user__username",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "price", "created_at")
    search_fields = ("title", "author")
    list_filter = ("category",)
    ordering = ("-created_at",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)
    ordering = ("-created_at",)


@admin.register(ModeratorCategory)
class ModeratorCategoryAdmin(admin.ModelAdmin):
    list_display = ("moderator", "category")
    search_fields = ("moderator__username", "category__name")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("book", "user", "approved", "created_at")
    search_fields = ("book__title", "user__username")
    list_filter = ("approved",)


@admin.register(EventLog)
class EventLogAdmin(admin.ModelAdmin):
    list_display = ("user", "message", "created_at")
    search_fields = ("message", "user__username")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "created_at", "total_price")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "id")
    ordering = ("-created_at",)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "book", "quantity", "total_price")
    search_fields = ("order__id", "book__title")


admin.site.register(Theme)
admin.site.register(GalleryImage)
admin.site.register(Slider)
admin.site.register(Event)
