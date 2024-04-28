from django.urls import path

from .views import *


app_name = 'skin_trade_api'
urlpatterns = [
    path('check/', Check.as_view()),
    path('auth/', SteamAuthAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('get_inventory/', GetInventoryAPIView.as_view()),
    path('get_balance/', GetBalanceAPIView.as_view()),
    path('sell/', SellItemAPIView.as_view()),
]
