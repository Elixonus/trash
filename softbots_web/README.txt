User interface:
To add node, left mouse down on empty space
To edit node, left mouse down on existing node
To delete node, right mouse down on existing node
To add link, left mousedown on existing node1 and left mouseup on existing node2
To delete link, (not sure yet)
(Should be no way to edit link)

User has three phases to go to in chronological order:
BUILD
TRAIN
TEST

BUILD - Make the softbot nodes, links, muscles. User drags and drops components of the
        softbot. Each component has a set of properties that can be modified. After the user
        builds the creature, it is normalized by translation only, for units to be conserved
        (no scale no rotation).
TRAIN - Use neural networks to find the optimal weights and biases to achieve the maximum
        distance traveled in an amount of time. Create a model for the softbot if not already
        made. Although the training can be set to a run a number of epochs or iterations, the
        user will select how much elapsing time to train it.
TEST - Use inference from the neural model to find the inferred bot actions in real time. Cool
       visualization of the softbot moving with nice graphics (terrain, sky, background objects).

Extra info:
Can switch between any phase but going from BUILD to TEST is not allowed.
Going to BUILD deletes the current model.
Only one model can be saved at a time.

Technologies to be used:
Javascript fully client-side
P5.js as mentioned for visualization
Tensorflow.js for machine learning

Project info:
To be made open-source (duh since it runs on client)
