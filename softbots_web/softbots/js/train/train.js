// @ts-check
'use strict';

{

let softbot; // Undefined

function softBotDestroy() {

  // There should be some methods to clean up the bot
  softbot = undefined;

}

function softBotBuild( tempBot ) {

  const newNodes = [],
    newLinks     = [];

  // Setup nodes and links
  for ( let n = 0; n < tempBot.nodes.length; n++ ) {

    const currNode = tempBot.nodes[n];

    if ( currNode.type === NODE_TYPES.NODE )
      newNodes.push( new Node( .1, new Vector( currNode.x, currNode.y ) ) );

  }

  for ( let l = 0; l < tempBot.links.length; l++ ) {

    const currLink = tempBot.links[l];

    let node1Ind = -1,
      node2Ind   = -1;

    // We want to copy the nodes
    for ( let n = 0; n < tempBot.nodes.length; n++ ) {

      const currNode = tempBot.nodes[n];

      if ( currNode.x === currLink.node1.x && currNode.y === currLink.node1.y )
        node1Ind = n;
      else if ( currNode.x === currLink.node2.x && currNode.y === currLink.node2.y )
        node2Ind = n;

    }

    if ( currLink.type === LINK_TYPES.LINK )
      newLinks.push( new Link( newNodes[node1Ind], newNodes[node2Ind], 100, 1 ) );
    else if ( currLink.type === LINK_TYPES.MUSCLE )
      newLinks.push( new Muscle( newNodes[node1Ind], newNodes[node2Ind], 100, 1 ) );

  }

  // Build the bot
  softbot = new Softbot( newNodes, newLinks );

  // Make it learn
  softbot.learn();
}

// Change view event
window.addEventListener( 'evt/viewChange', ( evt ) => {

  const {
    detail,
  } = evt;

  if ( detail === VIEWS.BUILD && softbot !== undefined )
    softBotDestroy();
  else if ( detail === VIEWS.TRAIN )
    softBotBuild( BOT );

});

// Bot Updated
window.addEventListener( 'evt/botUpload', () => {

  if ( STATE.view === VIEWS.TRAIN && softbot !== undefined ) {

    softBotDestroy();
    softBotBuild( BOT );

  }

});

let time = 0;
let iteration = 0;

function renderTrain()
{
  for(let n = 0; n < 1; n++)
  {
    softbot.iterate( 1 / 120 );

    // flex muscles once every ~400ms
    if ( iteration % 100 === 0 ) {
      softbot.learn();
    }

    iteration++;
  }

  drawNodesLinks();
}

function drawNodesLinks()
{

  const { ctx } = CANVAS;

  if ( ctx === undefined )
    return;

  for( let l = 0; l < softbot.links.length; l++ ) {

    const link = softbot.links[l];

    ctx.beginPath();
    ctx.moveTo( link.node1.position.x, link.node1.position.y );
    ctx.lineTo( link.node2.position.x, link.node2.position.y );

    // Muscle
    if ( link.type === LINK_TYPES.MUSCLE ) {

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 20;
      ctx.stroke();

      ctx.strokeStyle = `rgb(255, ${(200 * (1 - link.flex))}, ${(200 * (1 - link.flex))})`;
      ctx.lineWidth = 10;
      ctx.stroke();

    // Link
    } else if ( link.type === LINK_TYPES.LINK ) {

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 7;
      ctx.stroke();

    }

  }

  // NODES
  for( let n = 0; n < softbot.nodes.length; n++ ) {

    const node = softbot.nodes[n];

    ctx.beginPath();
    ctx.arc( node.position.x, node.position.y, 10, 0, 2 * Math.PI );

    ctx.fillStyle = '#FFF';
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.stroke();

  }

  // center of mass
  const centerOfMass = softbot.getCenterMass();

  ctx.beginPath();
    ctx.arc( centerOfMass.x, centerOfMass.y, 10, 0, 2 * Math.PI );

    ctx.fillStyle = '#EEE';
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.stroke();  

}

function minimum(values)
{
    let min;

    for(let n = 0; n < values.length; n++)
    {
        let value = values[n];

        if(min === undefined || value < min)
        {
            min = value;
        }
    }

    return min;
}

function maximum(values)
{
    let max;

    for(let n = 0; n < values.length; n++)
    {
        let value = values[n];

        if(max === undefined || value > max)
        {
            max = value;
        }
    }

    return max;
}

function average(values)
{
    let sum = 0;

    for(let n = 0; n < values.length; n++)
    {
        sum += values[n];
    }

    return sum / values.length;
}

function randomInteger(min = 0, max = 1)
{
    return Math.floor(randomFloat(min, max + 1));
}

function randomFloat(min = 0, max = 1)
{
    return Math.random() * (max - min) + min;
}

function clampMin(num, min)
{
    return Math.max(num, min)
}

function clampMax(num, max)
{
    return Math.min(num, max);
}

function clamp(num, min, max)
{
    return Math.min(Math.max(num, min), max);
}

function map(value, start1, stop1, start2, stop2)
{
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

window.renderTrain = renderTrain;

}