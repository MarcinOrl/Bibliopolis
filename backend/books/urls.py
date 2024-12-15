from django.urls import path
from .views import book_list, ThemeView, ThemeListView, SelectedThemeView

urlpatterns = [
    path("books/", book_list, name="book-list"),
    path("theme/default/", ThemeView.as_view(), name="theme"),
    path("themes/", ThemeListView.as_view(), name="thme_liset"),
    path("themes/select/", SelectedThemeView.as_view(), name="select-theme"),
]
