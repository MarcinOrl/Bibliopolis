from django.urls import path
from .views import (
    BookDetailAPIView,
    BookListAPIView,
    CategoryListAPIView,
    ThemeView,
    ThemeListView,
    SelectedThemeView,
    GalleryImageUploadView,
    UpdateSliderOrderView,
    SliderListView,
    SliderDetailView,
    ImageListView,
    UserProfileView,
    CreateOrderView,
    OrderDetailView,
    UpdateOrderStatusView,
    OrderListView,
    add_image_to_slider,
    set_default_slider,
    user_status,
    product_comments,
    approve_comment,
    reject_comment,
    get_user_events,
    create_book,
    approve_book,
    reject_book,
)

urlpatterns = [
    path("user_status/", user_status, name="user_status"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("books/", BookListAPIView.as_view(), name="book-list"),
    path("books/<int:pk>/", BookDetailAPIView.as_view(), name="book-detail"),
    path("books/create/", create_book, name="create_book"),
    path("books/<int:book_id>/approve/", approve_book, name="approve_book"),
    path("books/<int:book_id>/reject/", reject_book, name="reject_book"),
    path("categories/", CategoryListAPIView.as_view(), name="category-list"),
    path("books/<int:book_id>/comments/", product_comments, name="product_comments"),
    path("comments/<int:comment_id>/approve/", approve_comment, name="approve_comment"),
    path("comments/<int:comment_id>/reject/", reject_comment, name="reject_comment"),
    path("events/", get_user_events, name="get_user_events"),
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
    path("sliders/<int:slider_id>/set_default/", set_default_slider),
    path("order/", CreateOrderView.as_view(), name="create_order"),
    path("orders/", OrderListView.as_view(), name="order-list"),
    path("orders/<int:order_id>/", OrderDetailView.as_view(), name="order-detail"),
    path(
        "orders/<int:pk>/update-status/",
        UpdateOrderStatusView.as_view(),
        name="update_order_status",
    ),
]
