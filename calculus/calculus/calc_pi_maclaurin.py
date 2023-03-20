from math import pi
from time import sleep
import matplotlib.pyplot as plt
import numpy as np

print("This program will approximate the value of pi with the Maclaurin series")
sleep(1)
print("for arctan(x) at x=1, which we know is pi/4.")
sleep(1)
print("Therefore, the Maclaurin series at x=1 multiplied by 4 gives us pi.")
sleep(1)
print("Enter the number of summation terms you wish to use in the calculation (>= 2 please).")
sleep(0.5)

terms = 2
while True:
    try: terms = int(input("Terms: "))
    except: continue
    if terms >= 2: break


x = list(range(terms))
y = []

total = 0
for n in range(terms):
    if n % 2 == 0:
        total += 1 / (2*n+1)
    else:
        total -= 1 / (2*n+1)
    y.append(4 * total)

fig, ax = plt.subplots()
ax.plot(x, y, label="Maclauren series x 4")
ax.plot(x, np.full(terms, pi), label=r"$\pi$, Truth")
ax.legend()
ax.set(xlim=(0, terms-1))
ax.set_xlabel("Summation Terms")
ax.set_title("Showing the summation of 25 terms of the Maclauren\nseries for arctan(x) at x=1 (multiplied by 4) since arctan(1) is $\pi /4$.")
plt.show()