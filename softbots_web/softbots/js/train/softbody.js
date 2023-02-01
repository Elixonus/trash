class Softbody
{
    constructor(nodes, links)
    {
        this.nodes = nodes;
        this.links = links;
        return this;
    }

    iterate(deltaTime)
    {
        for(let n = 0; n < this.nodes.length; n++)
        {
            const node = this.nodes[n];
            node.force.set(new Vector(0, 0));
        }

        for(let n = 0; n < this.nodes.length; n++)
        {
            const node = this.nodes[n];
            node.force.add(new Vector(0, -980 * node.mass));
        }

        for(let l = 0; l < this.links.length; l++)
        {
            const link = this.links[l];
            const node1 = link.node1;
            const node2 = link.node2;
            const node1Force = (node1.position.copy().sub(node2.position))
            .div(node1.position.dist(node2.position))
            .mul(link.getForce());
            node1.force.add(node1Force);
            node2.force.sub(node1Force);
        }

        for(let n = 0; n < this.nodes.length; n++)
        {
            const node = this.nodes[n];

            if(node.position.y < 0)
            {
                const nodeForceNormal = new Vector(0, -500 * node.position.y);
                const nodeForceFriction = new Vector(-nodeForceNormal.y * Math.sign(node.velocity.x), 0);
                node.force.add(nodeForceNormal);
                node.force.add(nodeForceFriction);
            }
        }

        for(let n = 0; n < this.nodes.length; n++)
        {
            const node = this.nodes[n];
            node.acceleration = node.force.copy().div(node.mass);
            node.velocity.add(node.acceleration.copy().mul(deltaTime));
            node.position.add(node.velocity.copy().mul(deltaTime));
        }
    }
}

class Node
{
    constructor(mass, position)
    {
        this.mass = mass;
        this.position = position;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.force = new Vector(0, 0);
        return this;
    }
}

class Link
{
    constructor(node1, node2, stiffness, dampening, length = node1.position.dist(node2.position))
    {
        this.node1 = node1;
        this.node2 = node2;
        this.stiffness = stiffness;
        this.dampening = dampening;
        this.length = length;
        this.type = LINK_TYPES.LINK;
        return this;
    }

    getLength()
    {
        return this.node1.position.dist(this.node2.position);
    }

    getDisplacement()
    {
        return this.getLength() - this.length;
    }

    getVelocity()
    {
        return (this.node1.position.copy().sub(this.node2.position)).dot(this.node1.velocity.copy().sub(this.node2.velocity)) / this.getLength();
    }

    getStiffnessForce()
    {
        return -this.stiffness * this.getDisplacement();
    }

    getDampeningForce()
    {
        return -this.dampening * this.getVelocity();
    }

    getForce()
    {
        return this.getStiffnessForce() + this.getDampeningForce();
    }
}
