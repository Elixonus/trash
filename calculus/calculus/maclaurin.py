from typing import Callable


def factorial(n) -> int:
    if n == 0:
        return 1
    return factorial(n - 1) * n


class Monomial:
    power: int
    coefficient: float

    def __init__(self, power: int, coefficient: float) -> None:
        self.power = power
        self.coefficient = coefficient

    def __repr__(self) -> str:
        if self.coefficient >= 0:
            return f"+ {self.coefficient}x^{self.power}"
        elif self.coefficient < 0:
            return f"- {-self.coefficient}x^{self.power}"

    def evaluate(self, x: float) -> float:
        return self.coefficient * x ** self.power


class Polynomial:
    terms: list[Monomial]

    def __init__(self, terms: list[Monomial]) -> None:
        self.terms = terms

    def __repr__(self) -> str:
        string = str(self.terms[0])[2:]
        for term in self.terms[1:]:
            string += " " + str(term)
        return string

    def evaluate(self, x: float) -> float:
        return sum(term.evaluate(x) for term in self.terms)


class Maclaurin:
    nth_derivative: Callable[[int], float]

    def __init__(self, nth_derivative: Callable[[int], float]) -> None:
        self.nth_derivative = nth_derivative

    def polynomial(self, degree: int) -> Polynomial:
        terms: list[Monomial] = []
        for n in reversed(range(0, degree + 1)):
            terms.append(Monomial(n, self.nth_derivative(n) / factorial(n)))
        return Polynomial(terms)


def nth_derivative_sin_0(n: int) -> float:
    # assumes n >= 0
    if n % 4 == 0:
        return 0
    if n % 4 == 1:
        return 1
    if n % 4 == 2:
        return 0
    if n % 4 == 3:
        return -1


def nth_derivative_cos_0(n: int) -> float:
    # assumes n >= 0
    return nth_derivative_sin_0(n + 1)


if __name__ == "__main__":
    from time import sleep
    print("This is just a library, you might want to try the other files.")
    sleep(5)
