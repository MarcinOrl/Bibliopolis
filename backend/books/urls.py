from django.urls import path
from .views import (
    book_list,
    ThemeView,
    ThemeListView,
    SelectedThemeView,
    GalleryImageUploadView,
    UpdateSliderOrderView,
    SliderListView,
    SliderDetailView,
    ImageListView,
    UserProfileView,
    add_image_to_slider,
    user_status,
)

urlpatterns = [
    path("user_status/", user_status, name="user_status"),
    path("api/profile/", UserProfileView.as_view(), name="user_profile"),
    path("books/", book_list, name="book-list"),
    path("theme/default/", ThemeView.as_view(), name="theme"),
    path("themes/", ThemeListView.as_view(), name="theme-list"),
    path("themes/select/", SelectedThemeView.as_view(), name="select-theme"),
    path("upload/", GalleryImageUploadView.as_view(), name="gallery_image_upload"),
    path("images/", ImageListView.as_view(), name="image-list"),
    path(
        "update-slider-order/",
        UpdateSliderOrderView.as_view(),
        name="update_slider_order",
    ),
    path("sliders/", SliderListView.as_view(), name="slider-list"),
    path("sliders/<int:slider_id>/", SliderDetailView.as_view(), name="slider-detail"),
    path("sliders/<int:slider_id>/add_image/", add_image_to_slider),
]
