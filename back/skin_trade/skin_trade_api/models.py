import json

import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.db import models

# Create your models here.


class SteamUser(models.Model):
    steam_id = models.CharField(db_index=True, max_length=20, unique=True)
    balance = models.DecimalField(decimal_places=2, max_digits=9, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    sold_items = models.TextField(default=json.dumps({}))  # Stub for sell-implementation

    def generate_jwt_token(self):
        dt = datetime.now() + timedelta(hours=1)
        token = jwt.encode({
            'id': self.pk,
            'exp': dt
        }, settings.SECRET_KEY, algorithm='HS256')

        return token
