from random import random
from math import pi, hypot
from time import sleep
import matplotlib.pyplot as plt

print("This program will approximate the value of pi using Monte Carlo method.")
sleep(2)
print("Below, enter the number of points you wish to use in the calculation.")
sleep(1.5)

total_points = 1
while True:
    try: total_points = int(input("Number: "))
    except: continue
    if total_points >= 1:
        break

points_inside: list[tuple[float, float]] = []
points_outside: list[tuple[float, float]] = []
for n in range(total_points):
    point = (2 * random() - 1, 2 * random() - 1)
    if hypot(point[0], point[1]) < 1:
        points_inside.append(point)
    else:
        points_outside.append(point)

ratio = len(points_inside) / (len(points_inside) + len(points_outside))
pi_approx = 4 * ratio

fig, ax = plt.subplots()
ax.add_patch(plt.Rectangle((-1, -1), 2, 2, color="green", alpha=0.2))
ax.add_patch(plt.Circle((0, 0), 1, color="red", alpha=0.2, hatch="x"))
ax.scatter([p[0] for p in points_inside], [p[1] for p in points_inside], color="red")
ax.scatter([p[0] for p in points_outside], [p[1] for p in points_outside], color="green")
ax.set(xlim=(-1, 1), ylim=(-1, 1))
ax.set_title(r"$\pi \approx " + f"{pi_approx:.6f}$, Relative Error = {((pi_approx - pi) / pi):.5f}")
ax.set_aspect("equal")
plt.show()