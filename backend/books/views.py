from django.http import JsonResponse
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers, views, status
from decimal import Decimal
from django.contrib.auth.models import User
from .serializers import (
    BookSerializer,
    GalleryImageSerializer,
    SliderSerializer,
    CategorySerializer,
    OrderSerializer,
)
from .models import (
    Book,
    Theme,
    UserProfile,
    GalleryImage,
    Slider,
    Category,
    Order,
    OrderItem,
)


class BookDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            raise NotFound("Book not found")

        serializer = BookSerializer(book, context={"request": request})
        return Response(serializer.data)


class BookListAPIView(APIView):
    def get(self, request):
        category_id = request.query_params.get("category")
        if category_id:
            books = Book.objects.filter(category_id=category_id)
        else:
            books = Book.objects.all()
        serializer = BookSerializer(books, many=True, context={"request": request})
        return Response(serializer.data)


class CategoryListAPIView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


@api_view(["GET"])
@login_required
def user_status(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"is_admin": False, "is_moderator": False})

    profile = user.userprofile
    return Response(
        {
            "is_admin": profile.is_admin,
            "is_moderator": profile.is_moderator,
        }
    )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "username": user.username,
                "is_admin": user.userprofile.is_admin,
                "is_moderator": user.userprofile.is_moderator,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "address": user.userprofile.address,
                "city": user.userprofile.city,
                "postal_code": user.userprofile.postal_code,
                "phone_number": user.userprofile.phone_number,
            }
        )


class ThemeView(APIView):
    def get(self, request):
        theme = Theme.objects.first()
        if theme:
            return Response(
                {
                    "primary_color": theme.primary_color,
                    "secondary_color": theme.secondary_color,
                    "accent_color": theme.accent_color,
                }
            )
        else:
            return Response({"error": "No themes available."}, status=404)


class ThemeListView(APIView):
    def get(self, request):
        themes = Theme.objects.all()
        return Response(
            [
                {
                    "id": theme.id,
                    "name": theme.name,
                    "primary_color": theme.primary_color,
                    "secondary_color": theme.secondary_color,
                    "accent_color": theme.accent_color,
                }
                for theme in themes
            ]
        )


class SelectedThemeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        theme_id = request.data.get("theme_id")
        try:
            theme = Theme.objects.get(id=theme_id)
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            profile.selected_theme = theme
            profile.save()

            return Response(
                {
                    "primary_color": theme.primary_color,
                    "secondary_color": theme.secondary_color,
                    "accent_color": theme.accent_color,
                }
            )

        except Theme.DoesNotExist:
            return Response({"error": "Theme not found."}, status=404)

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        selected_theme = profile.selected_theme
        if selected_theme:
            return Response(
                {
                    "id": selected_theme.id,
                    "name": selected_theme.name,
                    "primary_color": selected_theme.primary_color,
                    "secondary_color": selected_theme.secondary_color,
                    "accent_color": selected_theme.accent_color,
                }
            )
        else:
            return Response({"error": "No theme selected."}, status=404)


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password", "password2", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"],
        )

        UserProfile.objects.create(user=user)

        return user


class RegisterView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GalleryImageUploadView(APIView):
    def post(self, request):
        file = request.FILES["file"]
        title = request.data.get("title", "")
        description = request.data.get("description", "")
        image = GalleryImage.objects.create(
            title=title, description=description, image=file
        )
        return Response({"id": image.id, "title": image.title}, status=201)


class AddImageView(APIView):
    def post(self, request):
        serializer = GalleryImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageListView(APIView):
    def get(self, request):
        images = GalleryImage.objects.all()
        serializer = GalleryImageSerializer(images, many=True)
        return Response(serializer.data)


class UpdateSliderOrderView(APIView):
    def patch(self, request):
        data = request.data
        for item in data:
            try:
                image = GalleryImage.objects.get(id=item["id"])
                image.slider_order = item["slider_order"]
                image.save()
            except GalleryImage.DoesNotExist:
                return Response({"error": "Image not found"}, status=404)
        return Response({"status": "Slider order updated"})


class SliderListView(views.APIView):
    def get(self, request):
        sliders = Slider.objects.all()
        serializer = SliderSerializer(sliders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SliderSerializer(data=request.data)
        if serializer.is_valid():
            slider = serializer.save()
            return Response(
                SliderSerializer(slider).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SliderDetailView(views.APIView):
    def get(self, request, slider_id):
        try:
            slider = Slider.objects.get(id=slider_id)
            serializer = SliderSerializer(slider)
            return Response(serializer.data)
        except Slider.DoesNotExist:
            return Response(
                {"error": "Slider not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, slider_id):
        try:
            slider = Slider.objects.get(id=slider_id)
            serializer = SliderSerializer(slider, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Slider.DoesNotExist:
            return Response(
                {"error": "Slider not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, slider_id):
        try:
            slider = Slider.objects.get(id=slider_id)
            slider.delete()
            return Response(
                {"message": "Slider deleted successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Slider.DoesNotExist:
            return Response(
                {"error": "Slider not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, slider_id):
        try:
            slider = Slider.objects.get(id=slider_id)
            image_id = request.data.get("image_id")
            if not image_id:
                return Response(
                    {"error": "Image ID is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            image = GalleryImage.objects.get(id=image_id)
            slider.images.remove(image)
            return Response(
                {"message": "Image removed from slider."}, status=status.HTTP_200_OK
            )
        except Slider.DoesNotExist:
            return Response(
                {"error": "Slider not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except GalleryImage.DoesNotExist:
            return Response(
                {"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(["POST"])
def add_image_to_slider(request, slider_id):
    try:
        slider = Slider.objects.get(id=slider_id)
    except Slider.DoesNotExist:
        return Response({"error": "Slider not found"}, status=status.HTTP_404_NOT_FOUND)

    image_id = request.data.get("image_id")
    try:
        image = GalleryImage.objects.get(id=image_id)
    except GalleryImage.DoesNotExist:
        return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

    # Dodajemy zdjęcie do slajdera
    slider.images.add(image)
    return Response({"message": "Image added to slider"}, status=status.HTTP_200_OK)


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        shipping_address = request.data.get("shipping_address")
        items_data = request.data.get("items", [])

        if not shipping_address or not items_data:
            return Response(
                {"detail": "Adres wysyłki i produkty są wymagane."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Tworzymy zamówienie
        order = Order.objects.create(user=user, shipping_address=shipping_address)

        total_price = Decimal("0.00")  # Zmieniamy na Decimal

        for item_data in items_data:
            book_id = item_data.get("book")
            quantity = item_data.get("quantity", 1)
            book = Book.objects.get(id=book_id)
            item_total_price = (
                book.price * quantity
            )  # Obliczanie wartości dla pojedynczego produktu
            total_price += item_total_price  # Dodaj do całkowitej wartości zamówienia

            OrderItem.objects.create(
                order=order, book=book, quantity=quantity, total_price=item_total_price
            )

        # Ustawiamy całkowitą wartość zamówienia
        order.total_price = total_price
        order.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.userprofile.is_admin or request.user.userprofile.is_moderator:
            orders = Order.objects.all()
        else:
            orders = Order.objects.filter(user=request.user)

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            raise NotFound("Order not found")


class UpdateOrderStatusView(APIView):
    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            new_status = request.data.get("status")
            if new_status in dict(Order.STATUS_CHOICES).keys():
                order.status = new_status
                order.save()
                return Response(
                    {"status": "Zmieniono status zamówienia"}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Nieprawidłowy status"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Order.DoesNotExist:
            return Response(
                {"error": "Zamówienie nie istnieje"}, status=status.HTTP_404_NOT_FOUND
            )
