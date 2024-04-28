import requests
from rest_framework import serializers, status


class SteamAuthSerializer(serializers.Serializer):
    claimed_id = serializers.CharField(max_length=255, write_only=True)
    identity = serializers.CharField(max_length=255, write_only=True)
    return_to = serializers.CharField(max_length=255, write_only=True)
    response_nonce = serializers.CharField(max_length=255, write_only=True)
    assoc_handle = serializers.CharField(max_length=255, write_only=True)
    signed = serializers.CharField(max_length=255, write_only=True)
    sig = serializers.CharField(max_length=255, write_only=True)

    def validate(self, data):
        check_data = {'openid.ns': 'http://specs.openid.net/auth/2.0',
                      'openid.mode': 'check_authentication',
                      'openid.op_endpoint': 'https://steamcommunity.com/openid/login',

                      'openid.claimed_id': data.get('claimed_id'),
                      'openid.identity': data.get('identity'),
                      'openid.return_to': data.get('return_to'),
                      'openid.response_nonce': data.get('response_nonce').replace(" ", "+"),
                      'openid.assoc_handle': data.get('assoc_handle'),
                      'openid.signed': data.get('signed'),
                      'openid.sig': data.get('sig').replace(" ", "+"),
                      }

        result = requests.get(
            url='https://steamcommunity.com/openid/login',
            params=check_data
        ).text.split('\n')[1]

        if result != 'is_valid:true':
            raise serializers.ValidationError("Bad OpenId params.", status.HTTP_400_BAD_REQUEST)

        return {}
