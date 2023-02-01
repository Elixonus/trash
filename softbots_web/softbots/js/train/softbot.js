let numActions = 1; // This will be updated based on the number of muscles
const flexPower = 1;


const rewards = []

function sampleAction( bot, action ) {

  const botIter = bot.copy();
  currCenter  = botIter.getCenterMass().x;

  // Flex the muscle
  if ( action !== numActions ) { // Do nothing if action === numAction

    const muscle = botIter.muscles[action];

    if ( muscle.flex !== flexPower )
    {
      muscle.setFlex( flexPower );
    }
    else
    {
      muscle.setFlex( 0 );
    }
  }

  for(let i = 0; i < 100; i++)
  {
    botIter.iterate(1 / 120);
  }
  
  const newCenter = botIter.getCenterMass().x;
  const reward = newCenter - currCenter;
  return reward;

}


function getState( muscles ) {

  const state = new Array(muscles.length);

  for ( let m = 0; m < muscles.length; m++ ) {
    state[m] = muscles[m].flex;
  }

  return state;

}


class Softbot extends Softbody
{
    constructor(nodes, links)
    {
        super(nodes, links);
        this.muscles = this.links.filter(function(link) { return link instanceof Muscle });
        let numMuscles = this.muscles.length;

        const env = {
          getNumStates() {
            return numMuscles;
          },
          getMaxNumActions() {

            numActions = numMuscles + 1;

            return numActions;
          }
        };

        const spec = {
          alpha: 0.01, // value function learning rate
          // update = 'qlearn'; // qlearn | sarsa
          // gamma = 0.9; // discount factor, [0, 1)
          // epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
          // experience_add_every = 10; // number of time steps before we add another experience to replay memory
          // experience_size = 5000; // size of experience replay memory
          // learning_steps_per_iteration = 20;
          // tderror_clamp = 1.0; // for robustness
          num_hidden_units: 10 // number of neurons in hidden layer
        };
        this.brain = new RL.DQNAgent(env, spec);
        return this;
    }

    learn()
    {
      // The cycle is 

      const state = this.getInputs(), // this has to be an array
        action    = this.brain.act( state ),
        reward    = sampleAction( this, action );
      console.log(reward);
      this.brain.learn( reward );

      // Flex the muscle
      if ( action !== numActions ) {

        const muscle = this.muscles[action];

        if ( muscle.flex !== flexPower )
          muscle.setFlex( flexPower );
        else
          muscle.setFlex( 0 );

      }

    }

    getInputs()
    {
        let inputs = [];
        let center = this.getCenterMass();
        
        for(let n = 0; n < this.nodes.length; n++)
        {
            const node = this.nodes[n];
            const position = node.position.copy().sub(center);
            inputs.push(position.x, position.y, node.velocity.x, node.velocity.y, node.acceleration.x, node.acceleration.y);
        }

        for(let l = 0; l < this.links.length; l++)
        {
            const link = this.links[l];
            inputs.push(link.getLength(), link.getVelocity(), link.getDisplacement());
        }

        return inputs;
    }

    getOutputs()
    {
        let outputsRaw = this.brain.act(this.getInputs());
        let outputs = dec2bin(outputsRaw).padStart(this.muscles.length, "0").split("");
        for(let o = 0; o < outputs.length; o++)
        {
            outputs[o] = parseInt(outputs[o]);
        }
        return outputs;
    }

    getMass()
    {
      let mass = 0;

      for(let n = 0; n < this.nodes.length; n++)
      {
        mass += this.nodes[n].mass;
      }

      return mass;
    }

    getCenterMass()
    {
        const center = new Vector(0, 0);

        for(let n = 0; n < this.nodes.length; n++)
        {
            const node = this.nodes[n];
            center.add(node.position.copy().mul(node.mass / this.getMass()));
        }

        return center;
    }

    set(softbot)
    {
        this.nodes = softbot.nodes;
        this.links = softbot.links;
        this.muscles = softbot.muscles;
    }
    
    copy()
    {
        let nodes = [];

        for(let n = 0; n < this.nodes.length; n++)
        {
            nodes.push(new Node(this.nodes[n].mass, this.nodes[n].position.copy()));
        }

        let links = [];

        for(let l = 0; l < this.links.length; l++)
        {
            let i1 = this.nodes.indexOf(this.links[l].node1);
            let i2 = this.nodes.indexOf(this.links[l].node2);

            if(this.links[l] instanceof Muscle)
            {
                links.push(new Muscle(nodes[i1], nodes[i2], this.links[l].stiffness, this.links[l].dampening, this.links[l].length));
            }

            else
            {
                links.push(new Link(nodes[i1], nodes[i2], this.links[l].stiffness, this.links[l].dampening, this.links[l].length));
            }
        }

        return new Softbot(nodes, links);
    }
}

class Muscle extends Link
{
    constructor(node1, node2, stiffness, dampening, length)
    {
        super(node1, node2, stiffness, dampening, length);
        this.flex = 0;
        this.lengthOriginal = this.length;
        this.type = LINK_TYPES.MUSCLE;
        return this;
    }

    setFlex(flex)
    {
        this.flex = flex;
        this.length = this.lengthOriginal * Math.min(Math.max(1 - 0.3 * flex, 0), 1);
    }
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}