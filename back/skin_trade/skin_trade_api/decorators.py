from django.core.cache import cache
from django.http import HttpResponse


def custom_login_required(view_func):
    def wrapper(request, *args, **kwargs):
        steam, token = request.headers.get('steam'), request.headers.get('token')
        if steam is None or token is None:
            return HttpResponse("Unauthorized", status=401)
        if cache.get(steam) != token:
            return HttpResponse("Unauthorized", status=401)

        return view_func(request, *args, **kwargs)
    return wrapper
