import json

import requests
from django.core.cache import cache
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .decorators import custom_login_required
from .serializers import SteamAuthSerializer
from .models import SteamUser


class Check(APIView):

    def get(self, request):
        return Response('?' + ''.join([f'{k.replace("openid.", "")}={v}&' for k, v in request.GET.items()]),
                        status=status.HTTP_200_OK)


class SteamAuthAPIView(APIView):

    def get(self, request):
        serializer = SteamAuthSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        steam_id = request.GET['identity'].split('/')[-1]
        user = None
        try:
            user = SteamUser.objects.get(steam_id=steam_id)
        except Exception as ignore:
            u = SteamUser(steam_id=steam_id)
            u.save()
            user = SteamUser.objects.get(steam_id=steam_id)

        token = user.generate_jwt_token()
        cache.set(steam_id, str(token), timeout=3600)

        return Response({
            'token': token,
            'steam_id': steam_id
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):

    @method_decorator(custom_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        cache.delete(request.headers.get('steam'))
        return Response('Logout successful.', status=status.HTTP_200_OK)


class GetBalanceAPIView(APIView):

    @method_decorator(custom_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return Response({'balance': SteamUser.objects.get(steam_id=request.headers.get('steam')).balance},
                        status=status.HTTP_200_OK)


class SellItemAPIView(APIView):

    @method_decorator(custom_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        steam = request.headers.get('steam')
        market_hash_name = request.headers.get('name')
        print(market_hash_name)

        user_csgo_items = requests.get(f'https://steamcommunity.com/inventory/{steam}/730/2?trading=1&l=russian').json()

        def find_item(market_hash_name):
            all_csgo_items = cache.get('all_csgo_items')
            if all_csgo_items is None:
                all_csgo_items = requests.get('https://csgobackpack.net/api/GetItemsList/v2/').json()
                cache.set('all_csgo_items', all_csgo_items, timeout=1800)

            uci = None
            for user_csgo_item in user_csgo_items['descriptions']:
                if user_csgo_item['market_hash_name'] == market_hash_name:
                    if user_csgo_item['tradable'] == 1:
                        uci = user_csgo_item

            if uci is None:
                return None

            for csgo_item in all_csgo_items['items_list'].items():
                if csgo_item[0] == uci['market_hash_name']:
                    return {'name': market_hash_name, 'price': csgo_item[1]['price']['30_days']['median']}

        item = find_item(market_hash_name)
        if item is None:
            return Response({'message': f'No such item with name: {market_hash_name}'}, status=status.HTTP_404_NOT_FOUND)

        steam_user = SteamUser.objects.get(steam_id=request.headers.get('steam'))

        sold_items = json.loads(steam_user.sold_items)
        for sold_item in sold_items:
            if sold_item == market_hash_name:
                return Response({'message': f'Already sold item: {market_hash_name}'},
                                status=status.HTTP_400_BAD_REQUEST)

        sold_items[market_hash_name] = {'price': item['price']}
        steam_user.sold_items = json.dumps(sold_items)
        steam_user.balance = int((float(steam_user.balance) + int((item['price'] / 2) * 100) / 100) * 100) / 100
        steam_user.save()

        return Response({'message': f'Item: {market_hash_name}, successfully sold!'}, status=status.HTTP_200_OK)


class GetInventoryAPIView(APIView):

    @method_decorator(custom_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):

        steam = request.headers.get('steam')
        user_csgo_items = requests.get(f'https://steamcommunity.com/inventory/{steam}/730/2?trading=1&l=russian').json()

        all_csgo_items = cache.get('all_csgo_items')
        if all_csgo_items is None:
            all_csgo_items = requests.get('https://csgobackpack.net/api/GetItemsList/v2/').json()
            cache.set('all_csgo_items', all_csgo_items, timeout=1800)

        user_sold_items = json.loads(SteamUser.objects.get(steam_id=steam).sold_items)

        user_csgo_items_with_price = {'items': []}
        for user_csgo_item in user_csgo_items['descriptions']:
            if user_csgo_item['tradable'] == 1:
                for csgo_item in all_csgo_items['items_list'].items():
                    if csgo_item[0] == user_csgo_item['market_hash_name']:

                        if user_csgo_item['market_hash_name'] not in user_sold_items.keys():

                            user_csgo_items_with_price['items'].append({
                                'name': csgo_item[1]['name'],
                                'classid': csgo_item[1]['classid'],
                                'icon_url': csgo_item[1]['icon_url'],
                                'rarity': csgo_item[1]['rarity'],
                                'rarity_color': csgo_item[1]['rarity_color'],
                                'price': csgo_item[1]['price']
                            })

        return Response(user_csgo_items_with_price, status=status.HTTP_200_OK)
