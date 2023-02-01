from django.contrib import admin
from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^bot/?(?P<bot_id>\d{9})?/?', views.bot, name='Bot'),
    re_path(r'^bot/(?P<bot_id>\d{9})/node/?', views.bot_node_create),
    re_path(r'^bot/(?P<bot_id>\d{9})/node/(?P<node_id>\d{9})/?', views.bot_node_access),
    re_path(r'^bot/(?P<bot_id>\d{9})/link/?', views.bot_link_create),
    re_path(r'^bot/(?P<bot_id>\d{9})/link/(?P<node_id>\d{9})/?', views.bot_link_access),
    re_path(r'^bot/(?P<bot_id>\d{9})/model/(?P<node_id>\d{9})/?', views.bot_model_create),
    re_path(r'^bot/(?P<bot_id>\d{9})/model/(?P<node_id>\d{9})/?', views.bot_model_access),
    path('admin/', admin.site.urls),
]
