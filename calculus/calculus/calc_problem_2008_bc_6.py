import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import Normalize

while True:
    try:
        do = int(input("Do [1-3]: "))
    except:
        print("Visualization number has to be either (1, 2, 3)")
        continue
    if do >= 1 and do <= 3:
        break
    else:
        print("Visualization number has to be either (1, 2, 3)")

# make a stream function:
X, Y = np.meshgrid(np.linspace(-1, 9, 256), np.linspace(-1, 9, 256))
# make U and V out of the streamfunction:
U = np.ones(shape=(256, 256))
V = np.empty(shape=(256, 256))

specialY = np.empty(256)

lin = np.linspace(-1, 9, 256)
for z in range(256):
    theX = lin[z]
    specialY[z] = 8 - 2*theX + (5/4)*theX**2

for a in range(256):
    for b in range(256):
        V[a][b] = Y[a][b]/8 * (6-Y[a][b])

x, y = np.meshgrid(np.linspace(-1, 9, 20), np.linspace(-1, 9, 20))
# make U and V out of the streamfunction:
u = np.ones(shape=(20, 20))
v = np.empty(shape=(20, 20))

for a in range(20):
    for b in range(20):
        v[a][b] = y[a][b]/8 * (6-y[a][b])
        length = (u[a][b]**2 + v[a][b]**2)**0.5
        v[a][b] /= length
        u[a][b] /= length

# plot:
fig, ax = plt.subplots()

stuff = abs(V / U)

if do == 1:
    ax.streamplot(X, Y, U, V,
                  density=1,
                  linewidth=1,
                  color=stuff,
                  cmap="jet",
                  norm=Normalize(np.percentile(stuff, 10), np.percentile(stuff, 90)))
    plt.title("Various solutions to the differential equation " + r"$\frac{dy}{dt} = \frac{y}{8} (6 - y)$")

if do == 2 or do == 3:
    ax.quiver(x, y, u, v)
    ax.streamplot(X, Y, U, V,
                  linewidth=3,
                  color="black",
                  norm=Normalize(np.percentile(stuff, 10), np.percentile(stuff, 90)),
                  start_points=[(0, 8)])

    if do == 3:
        plt.title("Solution $f(t)$ to the differential equation with $f(0) = 8$ and\n2nd degree Taylor polynomial "
                  "approximation around $x=0$")
        ax.plot(np.linspace(-1, 9, 256), specialY, color="red", linewidth=3)
    else:
        plt.title("Solution $f(t)$ to the differential equation with $f(0) = 8$")

plt.xlim(-1, 9)
plt.ylim(-1, 9)
plt.xlabel("$x$")
plt.ylabel("$y$")

plt.show()
