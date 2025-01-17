from rest_framework import serializers
from .models import (
    Book,
    GalleryImage,
    Slider,
    Category,
    Order,
    OrderItem,
    Comment,
    Event,
    UserProfile,
)


class CategorySerializer(serializers.ModelSerializer):
    moderators = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.filter(is_moderator=True), many=True
    )

    class Meta:
        model = Category
        fields = ["id", "name", "moderators"]


class BookSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    category = CategorySerializer()

    class Meta:
        model = Book
        fields = ["id", "title", "author", "description", "price", "image", "category"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "username", "content", "approved", "created_at"]
        read_only_fields = ["id", "user", "approved", "created_at"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["action", "description", "created_at"]


class GalleryImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = ["id", "title", "description", "image"]

    def get_image(self, obj):
        request = self.context.get("request")
        if not request:
            return obj.image.url
        return request.build_absolute_uri(obj.image.url)


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
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "username",
            "shipping_address",
            "status",
            "created_at",
            "updated_at",
            "total_price",
            "items",
        ]
