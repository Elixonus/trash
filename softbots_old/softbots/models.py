from tkinter import CASCADE
from django.db import models
from django.contrib import admin

class Node(models.Model):
    node_bot_id = models.ForeignKey('Bot', on_delete=models.CASCADE)
    node_id = models.IntegerField()
    node_mass = models.FloatField()
    node_position_x = models.FloatField()
    node_position_y = models.FloatField()

class Link(models.Model):
    link_bot_id = models.ForeignKey('Bot', on_delete=models.CASCADE)
    link_id = models.IntegerField()
    link_node1_id = models.ForeignKey('Node', on_delete=models.CASCADE, related_name='node1_id')
    link_node2_id = models.ForeignKey('Node', on_delete=models.CASCADE, related_name='node2_id')
    link_length = models.FloatField()
    link_stiffness = models.FloatField()
    link_dampening = models.FloatField()

class Bot(models.Model):
    bot_id = models.IntegerField()
    nodes = models.ManyToManyField(Node)
    links = models.ManyToManyField(Link)

admin.site.register(Bot)
admin.site.register(Node)
admin.site.register(Link)