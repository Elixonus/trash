from time import sleep
import matplotlib.pyplot as plt
import numpy as np
from maclaurin import Maclaurin


def nth_derivative_e2x_0(n: int) -> float:
    return 2**n


print("This program will show the Maclaurin series for e^(2x).")
sleep(2)
print("Here, enter the degree of the finite polynomial.")
sleep(1)
degree = 0
while True:
       try: degree = int(input("Degree: "))
       except: continue
       if degree >= 0: break


polynomial = Maclaurin(nth_derivative_e2x_0).polynomial(degree)

x = np.linspace(0, 2, 100)
y = np.exp(2*x)
y_maclaurin = np.empty(100)
for i in range(len(x)):
    y_maclaurin[i] = polynomial.evaluate(x[i])



fig, ax = plt.subplots()
ax.plot(x, y, linewidth=3)
ax.plot(x, y_maclaurin, linewidth=3, color="green")
ax.legend(["e^(2x)", f"Maclaurin Series {degree}th degree"])
ax.fill_between(x, y, y_maclaurin, alpha=0.3)
plt.xlim((0, 2))
plt.ylim((0, 11))
plt.show()