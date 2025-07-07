# backend/middleware.py

from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.http import HttpResponse

class CORSMediaMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.path.startswith(settings.MEDIA_URL):
            response['Access-Control-Allow-Origin'] = 'https://bookstore-testing.netlify.app'
            response['Access-Control-Allow-Credentials'] = 'true'
        return response
