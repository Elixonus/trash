from time import sleep
import numpy as np

print("This program will find the equation of a plane given three points.")
sleep(1)

point1_x = 0
point1_y = 0
point1_z = 0
point2_x = 0
point2_y = 0
point2_z = 0
point3_x = 0
point3_y = 0
point3_z = 0

while True:
    try: point1_x = float(input("Point 1's x: "))
    except: continue
    break
while True:
    try: point1_y = float(input("Point 1's y: "))
    except: continue
    break
while True:
    try: point1_z = float(input("Point 1's z: "))
    except: continue
    break

while True:
    try: point2_x = float(input("Point 2's x: "))
    except: continue
    break
while True:
    try: point2_y = float(input("Point 2's y: "))
    except: continue
    break
while True:
    try: point2_z = float(input("Point 2's z: "))
    except: continue
    break

while True:
    try: point3_x = float(input("Point 3's x: "))
    except: continue
    break
while True:
    try: point3_y = float(input("Point 3's y: "))
    except: continue
    break
while True:
    try: point3_z = float(input("Point 3's z: "))
    except: continue
    break

print(f"Points: ({point1_x}, {point1_y}, {point1_z}), ({point2_x}, {point2_y}, {point2_z}), ({point3_x}, {point3_y}, {point3_z})")

vector1_x = point1_x - point2_x
vector1_y = point1_y - point2_y
vector1_z = point1_z - point2_z
vector2_x = point1_x - point3_x
vector2_y = point1_y - point3_y
vector2_z = point1_z - point3_z
vectorn_x = vector1_y * vector2_z - vector1_z * vector2_y
vectorn_y = vector1_x * vector2_z - vector1_z * vector2_x
vectorn_z = vector1_x * vector2_y - vector1_y * vector2_x
a = vectorn_x
b = vectorn_y
c = vectorn_z
d = a * point1_x + b * point1_y + c * point1_z

print(f"Equation of the plane is: {a} * X + {b} * Y + {c} * Z = {d}")
