from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers, views, status
from django.contrib.auth.models import User


@api_view(["GET"])
def book_list(request):
    books = [
        {"id": 1, "title": "Django Unchained"},
        {"id": 2, "title": "React in Action"},
        {"id": 3, "title": "Clean Code"},
        {"id": 4, "title": "The Pragmatic Programmer"},
        {"id": 5, "title": "The Art of Computer Programming"},
        {"id": 6, "title": "Game of Thrones"},
        {"id": 7, "title": "The Lord of the Rings"},
        {"id": 8, "title": "The Hobbit"},
        {"id": 9, "title": "The Catcher in the Rye"},
        {"id": 10, "title": "To Kill a Mockingbird"},
    ]
    return Response(books)


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
