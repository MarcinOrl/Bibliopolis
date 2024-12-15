from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers, views, status
from django.contrib.auth.models import User
from .serializers import BookSerializer
from .models import Book, Theme, UserProfile


@api_view(["GET"])
def book_list(request):
    query = request.GET.get("query", "").lower()

    if query:
        books = Book.objects.filter(title__icontains=query)
    else:
        books = Book.objects.all()

    serializer = BookSerializer(books, many=True)

    return Response(serializer.data)


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
