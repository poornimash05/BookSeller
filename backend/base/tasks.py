from celery import shared_task
from .models import AdminPushNotification
from .utils import send_fcm_notification
from base.models import FCMToken

@shared_task
def send_scheduled_notification(title, message):
    tokens = FCMToken.objects.all()
    from pyfcm import FCMNotification
    push_service = FCMNotification(api_key="YOUR_SERVER_KEY")

    registration_ids = [t.token for t in tokens]

    if registration_ids:
        result = push_service.notify_multiple_devices(
            registration_ids=registration_ids,
            message_title=title,
            message_body=message
        )
        return result
