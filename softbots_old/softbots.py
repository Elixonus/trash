from __future__ import annotations
from softbodies import Node, Link


class Softbot:
    nodes: list[Node]
    links: list[Link]
    muscles: list[Muscle]

    def __init__(self, nodes: list[Node], links: list[Link], muscles: list[Muscle]) -> None:
        self.nodes = nodes
        self.links = links
        self.muscles = muscles


class Muscle(Link):
    activation: float
    length_original: float

    def __init__(self, nodes: tuple[Node, Node], stiffness: float, dampening: float, length: float = None) -> None:
        super().__init__(nodes, stiffness, dampening, length)
        self.activation = 0
        self.length_original = self.length

    def set_length(self, activation) -> None:
        self.activation = activation
        self.length = self.length_original * min(max((1 - 0.5 * activation), 0), 1)
