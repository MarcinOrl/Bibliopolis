from django.contrib import admin
from .models import Book, Theme, GalleryImage, Slider, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "is_admin", "is_moderator")
    list_filter = ("is_admin", "is_moderator")
    search_fields = ("user__username",)


# Register your models here.
admin.site.register(Book)
admin.site.register(Theme)
admin.site.register(GalleryImage)
admin.site.register(Slider)
