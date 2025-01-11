from django.contrib import admin
from .models import (
    Book,
    Category,
    Theme,
    GalleryImage,
    Slider,
    UserProfile,
    Order,
    OrderItem,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "is_admin", "is_moderator")
    list_filter = ("is_admin", "is_moderator")
    search_fields = ("user__username",)


admin.site.register(Book)
admin.site.register(Category)
admin.site.register(Theme)
admin.site.register(GalleryImage)
admin.site.register(Slider)
admin.site.register(Order)
admin.site.register(OrderItem)
