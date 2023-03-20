from math import sin
import numpy as np
import matplotlib.pyplot as plt

number_steps = 45
end_x = 30

x = np.linspace(0, end_x, 10000)
y = np.sin(x)
y_derivative = np.cos(x)
# integral of y(x) is -cos(x)
y_integral = -np.cos(x) + 1


x_numerical = np.linspace(0, end_x, number_steps)

y_integral_euler = np.empty(number_steps)
last = 0
for n in range(number_steps):
    y_integral_euler[n] = last
    last += sin(x_numerical[n]) * (end_x / number_steps)

y_integral_trapezoid = np.empty(number_steps)

last = 0
for n in range(number_steps - 1):
    y_integral_trapezoid[n] = last
    last += 0.5 * (sin(x_numerical[n]) + sin(x_numerical[n + 1])) * (end_x / number_steps)
y_integral_trapezoid[-1] = last


fig, ax = plt.subplots()
ax.plot(x, y_integral)
ax.plot(x_numerical, y_integral_euler)
ax.plot(x_numerical, y_integral_trapezoid)
plt.show()