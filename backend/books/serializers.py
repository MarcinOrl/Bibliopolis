from rest_framework import serializers
from .models import Book, GalleryImage, Slider, Category, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "title", "author", "description", "price", "image"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ["id", "title", "description", "image"]


class SliderSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = Slider
        fields = ["id", "images"]


class OrderItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title")

    class Meta:
        model = OrderItem
        fields = ["book_title", "quantity", "total_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = serializers.CharField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "shipping_address",
            "status",
            "created_at",
            "updated_at",
            "total_price",
            "items",
        ]
