from math import tau
import cairo
from PIL import Image
import numpy as np
from mesh import Mesh
from vectors import Vector


def render(mesh: Mesh) -> None:
    nodes = mesh.nodes
    links = mesh.links
    minimum = Vector(min(node.point.x for node in nodes), min(node.point.y for node in nodes))
    maximum = Vector(max(node.point.x for node in nodes), max(node.point.y for node in nodes))
    camera_position = (minimum + maximum) / 2
    camera_zoom = 1.1 / (min(maximum.x - minimum.x, maximum.y - minimum.y))

    surface = cairo.ImageSurface(cairo.FORMAT_RGB24, 1000, 1000)
    context = cairo.Context(surface)
    context.scale(1000, 1000)
    context.rectangle(0, 0, 1, 1)
    context.set_source_rgb(1, 1, 1)
    context.fill()
    context.translate(0.5, 0.5)
    context.scale(1, -1)
    context.scale(camera_zoom, camera_zoom)
    context.translate(-camera_position.x, -camera_position.y)

    for link in links:
        context.move_to(link.nodes[0].point.x, link.nodes[0].point.y)
        context.line_to(link.nodes[1].point.x, link.nodes[1].point.y)
        context.set_source_rgb(0, 0, 0)
        context.set_line_width(0.015 / camera_zoom)
        context.set_line_cap(cairo.LINE_CAP_ROUND)
        context.stroke()

    for node in nodes:
        context.arc(node.point.x, node.point.y, 0.02 / camera_zoom, 0, tau)
        context.set_source_rgb(1, 1, 1)
        context.fill_preserve()
        context.set_source_rgb(0, 0, 0)
        context.set_line_width(0.01 / camera_zoom)
        context.stroke()

    image = Image.fromarray(np.array(surface.get_data()).reshape((1000, 1000, 4)), mode="RGBA")
    image.show()
