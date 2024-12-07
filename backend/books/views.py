from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response


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
