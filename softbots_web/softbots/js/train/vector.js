class Vector
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        return this;
    }

    set(vector)
    {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    add(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector)
    {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    mul(number)
    {
        this.x *= number;
        this.y *= number;
        return this;
    }

    div(number)
    {
        this.x /= number;
        this.y /= number;
        return this;
    }

    len()
    {
        return Math.hypot(this.x, this.y);
    }

    dist(vector)
    {
        return Math.hypot(this.x - vector.x, this.y - vector.y);
    }

    dot(vector)
    {
        return this.x * vector.x + this.y * vector.y;
    }

    cross(vector)
    {
        return this.x * vector.y - this.y * vector.x;
    }

    copy()
    {
        return new Vector(this.x, this.y);
    }
}
