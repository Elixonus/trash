from __future__ import annotations
from typing import Callable


class Function:
    function: Callable[[float], float]

    def __init__(self, function: Callable[[float], float]) -> None:
        self.function = function

    def value(self, x: float) -> float:
        return self.function(x)

    def limit_left(self, x: float, xl: float) -> float:
        yl = self.value(xl)
        for n in range(100):
            try:
                yl = self.value(xl + (x - xl) * ((n + 1) / 100))
            except ValueError:
                break
        limit = yl
        return limit

    def limit_right(self, x: float, xr: float) -> float:
        limit = self.limit_left(x, xr)
        return limit

    def derivative_range(self, x1: float, x2: float) -> float:
        y1 = self.value(x1)
        y2 = self.value(x2)
        derivative = (y2 - y1) / (x2 - x1)
        return derivative

    def derivative(self, xc: float, step: float) -> float:
        x1 = xc - step / 2
        x2 = xc + step / 2
        derivative = self.derivative_range(x1, x2)
        return derivative

    def derivative_forward(self, xl: float, step: float) -> float:
        derivative = self.derivative(xl + step / 2, step)
        return derivative

    def derivative_backward(self, xl: float, step: float) -> float:
        derivative = self.derivative(xl - step / 2, step)
        return derivative

    def integral_riemann_left(self, x1: float, x2: float, steps: int) -> float:
        step = (x2 - x1) / steps
        integral = 0
        for n in range(steps):
            x = x1 + n * step
            y = self.value(x)
            integral += y * step
        return integral

    def integral_riemann_right(self, x1: float, x2: float, steps: int) -> float:
        step = (x2 - x1) / steps
        integral = self.integral_riemann_left(x1 + step, x2 + step, steps)
        return integral

    def integral_riemann_center(self, x1: float, x2: float, steps: int) -> float:
        step = (x2 - x1) / steps
        integral = self.integral_riemann_left(x1 + step / 2, x2 + step / 2, steps)
        return integral

    def integral_trapezoid(self, x1: float, x2: float, steps: int) -> float:
        step = (x2 - x1) / steps
        integral = 0
        for n in range(steps):
            xl = x1 + n * step
            xr = x1 + (n + 1) * step
            yl = self.value(xl)
            yr = self.value(xr)
            integral += (yl + yr) / 2
        return integral


class Polynomial(Function):
    powers: list[int]
    coefficients: list[float]

    def __init__(self, powers: list[int], coefficients: list[float]) -> None:
        def function(x: float) -> float:
            y = 0
            for n in range(len(powers)):
                y += coefficients[n] * x ** powers[n]
            return y
        super().__init__(function)

    def true_limit(self, x: float) -> float:
        limit = self.value(x)
        return limit

    def true_derivative(self, x: float) -> float:
        derivative = 0
        for power, coefficient in zip(self.powers, self.coefficients):
            derivative += (coefficient * power) * x ** (power - 1)
        return derivative

    def true_integral(self, x1: float, x2: float) -> float:
        integral = 0
        for power, coefficient in zip(self.powers, self.coefficients):
            integral += (coefficient / power) * (x2 ** (power + 1) - x1 ** (power + 1))
        return integral


if __name__ == "__main__":
    from time import sleep
    print("This is just a library, you might want to try the other files.")
    sleep(5)
