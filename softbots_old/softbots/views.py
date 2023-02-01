from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import jsonpickle
from .models import Bot, Node, Link
from django.views.decorators.csrf import csrf_exempt
from random import randrange
import json
from django.core import serializers

def encodeBot( bot ) -> str:
    jsonSer = serializers.serialize('json', [ bot, ])
    data = json.loads( jsonSer )

    # Remove `pk` and `model` properties
    for d in data:
        del d['pk']
        del d['model']

    return json.dumps( data )

@csrf_exempt
def bot(request, bot_id=-1):
    # Delete a bot
    if request.method == "GET":
        try:
            bot = Bot.objects.get(bot_id=bot_id)
        except Bot.DoesNotExist:
            pass
        else:
            data = encodeBot( bot )
            return JsonResponse( data, safe=False )
        return HttpResponse()

    # Create a bot
    if request.method == "POST":
        bot_id = randrange(0, 10**9)
        bot = Bot(bot_id=bot_id)
        bot.save()
        return HttpResponse(json.dumps(bot_id), content_type="application/json")

    # Delete a bot
    if request.method == "DELETE":
        try:
            bot = Bot.objects.get(bot_id=bot_id)
        except Bot.DoesNotExist:
            pass
        else:
            bot.delete()
        return HttpResponse()

    return HttpResponseNotFound()


def bot_node_create(request, bot_id):
    if request.method == "POST":
        try:
            bot = Bot.objects.get(bot_id=bot_id)
        except Bot.DoesNotExist:
            pass
        else:
            pass # working on this
    return HttpResponseNotFound()


def bot_node_access(request, node_id):
    return HttpResponse("Bot Node")


def bot_link_create(request):
    return HttpResponse("Bot Link Init")


def bot_link_access(request, link_id):
    return HttpResponse("Bot Link")


def bot_model_create(request):
    return HttpResponse("Bot Model Init")


def bot_model_access(request, model_id):
    return HttpResponse("Bot Model")
