from django.contrib import admin
from .models import Book, Theme, GalleryImage

# Register your models here.
admin.site.register(Book)
admin.site.register(Theme)
admin.site.register(GalleryImage)
