from time import sleep
import matplotlib.pyplot as plt
import numpy as np
from maclaurin import Maclaurin, nth_derivative_cos_0

print("This program will show the Maclaurin series for cos(x).")
sleep(2)
print("Here, enter the degree of the finite polynomial.")
sleep(1)
degree = 0
while True:
       try: degree = int(input("Degree: "))
       except: continue
       if degree >= 0: break


polynomial = Maclaurin(nth_derivative_cos_0).polynomial(degree)

x = np.linspace(0, 10, 100)
y = np.cos(x)
y_maclaurin = np.empty(100)
for i in range(len(x)):
    y_maclaurin[i] = polynomial.evaluate(x[i])



fig, ax = plt.subplots()
ax.plot(x, y, linewidth=3)
ax.plot(x, y_maclaurin, linewidth=3, color="violet")
ax.legend([r"$\cos(x)$", f"Maclaurin Series {degree}th degree"])
ax.fill_between(x, y, y_maclaurin, alpha=0.3)
plt.xlim((0, 10))
plt.ylim((-2, 2))
plt.show()