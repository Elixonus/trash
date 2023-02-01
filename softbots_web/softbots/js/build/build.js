// @ts-check
'use strict';

{

/**
 * Input change events
 */
function inputEvents() {

  queryAll( '.inp__radio' ).forEach( ( el ) => {

    el.addEventListener( 'change', () => {

      if ( el.closest( '.state__btns' ) ) {

        STATE.state = query( 'input[name="state"]:checked' )?.value;

        window.dispatchEvent( new CustomEvent( 'evt/stateChange', {
          detail: STATE.state,
        }) );

      } else if ( el.closest( '.view__btns' ) ) {

        STATE.view = setView();

        // Reset camera
        CANVAS.camera.x = 0;
        CANVAS.camera.y = 200;

        window.dispatchEvent( new CustomEvent( 'evt/viewChange', {
          detail: STATE.view,
        }) );

      }

      updateState();
      updateInfo();

    });

  });

  updateState();

}

const orig = {
    sel: false,
    x:   0,
    y:   0,
  },
  origCamera = {
    x: CANVAS.camera.x,
    y: CANVAS.camera.y,
  };

/**
 * Canvas events (mousemove/resize)
 */
function canvasEvts() {

  CANVAS.canvas = query( '#canvas' );

  if ( CANVAS.canvas === null )
    return;

  const { canvas } = CANVAS;

  let canvasPos = canvas.getBoundingClientRect();

  CANVAS.canvH = canvas.clientWidth;
  CANVAS.canvW = canvas.clientWidth;

  // Mousemove on canvas
  canvas?.addEventListener( 'mousemove', ( evt ) => {

    MOUSE.x = evt.clientX - canvasPos.left;
    MOUSE.y = evt.clientY - canvasPos.top;

    STATE.moved = false;

    normalizeMousePos();

    // Middle click
    if ( STATE.move && STATE.mouseD ) {

      const move = {
        x: orig.x - MOUSE.x + origCamera.x,
        y: MOUSE.y - orig.y + origCamera.y,
      };

      CANVAS.camera.x = move.x;
      CANVAS.camera.y = move.y;

      return;

    }

    if ( STATE.view !== VIEWS.BUILD )
      return;

    // Node interactions on mousemove
    if ( STATE.state === 'node' ) {

      // Move preview node
      const lastNode = BOT.nodes[BOT.nodes.length - 1];

      let mousePosX = MOUSE.normX,
        mousePosY   = MOUSE.normY;

      if ( STATE.shift && BOT.nodes.length >= 2 ) {

        const lastNodeP = BOT.nodes[BOT.nodes.length - 2],
          newPos        = applyNewAngle( lastNodeP.x, lastNodeP.y, mousePosX, mousePosY );

        mousePosX = newPos.x;
        mousePosY = newPos.y;

      }

      lastNode.x = mousePosX;
      lastNode.y = mousePosY;

      // Move a node if selected
      if ( STATE.select.length && STATE.mouseD ) {

        for ( let i = 0; i < STATE.select.length; i++ ) {

          const currNode = BOT.nodes[STATE.select[i]];

          let newPos = {
            x: MOUSE.normX,
            y: MOUSE.normY,
          }

          if ( STATE.shift && orig.sel )
            newPos = applyNewAngle( orig.x, orig.y, newPos.x, newPos.y );

          currNode.x = newPos.x;
          currNode.y = newPos.y;

        }

        STATE.moved = true;

      // Check if mouse is hovering a node
      } else {

        STATE.hover = [];

        for( let n = 0; n < BOT.nodes.length - 1; n++ ) {

          const node = BOT.nodes[n];

          if ( insideCircle( node.x, node.y, 20, MOUSE.normX, MOUSE.normY ) ) {

            node.state = MOUSE_EVT.HOVER;
            lastNode.x = node.x;
            lastNode.y = node.y;

            STATE.hover.push( n );

          } else
            node.state = MOUSE_EVT.NONE;

        }

      }

    // Links interaction on mousemove
    } else if ( STATE.state === 'link' ) {

      STATE.hover = [];

      let hasPreviewGone = false;

      // Check if mouse is hovering a link
      for ( let i = 0; i < BOT.links.length; i++ ) {

        const link = BOT.links[i];

        if ( isOnLine( link.node1, link.node2 ) ) {

          link.state = MOUSE_EVT.HOVER;
          STATE.hover.push( i );

        } else {

          link.state = MOUSE_EVT.NONE;

          if ( link.type === LINK_TYPES.PREVIEW )
            hasPreviewGone = true;

        }

      }

      // if not hovering check if we can preview a link
      if ( STATE.hover.length === 0 && !hasPreviewGone ) {

        // We want only 1 link
        let preview = false;

        for ( let n = 0; n <= BOT.nodes.length - 1; n++ ) {

          const node = BOT.nodes[n],
            realInd  = n + 1;

          if ( preview )
            continue;

          for ( let nInn = realInd; nInn <= BOT.nodes.length - 1; nInn++ ) {

            const nextNode = BOT.nodes[nInn];

            if ( preview )
              continue;

            if ( isOnLine( node, nextNode ) ) {

              linkAdd( node, nextNode );
              preview = true;

            }

          }

        }

      }

      // Remove preview link
      if ( hasPreviewGone )
        BOT.links.pop();

    }

    updateInfo();

  });

  canvas?.addEventListener( 'mousedown', ( evt ) => {

    STATE.select = [];
    STATE.mouseD = true;

    // Middle click
    if ( STATE.move ) {

      origCamera.x = CANVAS.camera.x;
      origCamera.y = CANVAS.camera.y;

      orig.x = evt.clientX - canvasPos.left;
      orig.y = evt.clientY - canvasPos.top;

      return;

    }

    if ( STATE.view !== VIEWS.BUILD )
      return;

    // Select a node for movement
    if ( STATE.state === 'node' ) {

      if ( !STATE.hover.length )
        return;

      for ( let i = 0; i < STATE.hover.length; i++ ) {

        const selNode = BOT.nodes[STATE.hover[i]]

        selNode.state = MOUSE_EVT.SELECTED;
        STATE.select.push( STATE.hover[i] );

        orig.sel = true;
        orig.x   = selNode.x;
        orig.y   = selNode.y;

      }

    }

  });

  canvas?.addEventListener( 'mouseup', ( evt ) => {

    MOUSE.x = evt.clientX - canvasPos.left;
    MOUSE.y = evt.clientY - canvasPos.top;

    STATE.mouseD = false;
    orig.sel     = false;

    const leftClick = ( evt.button === 0 ),
      rightClick    = ( evt.button === 2 );

    normalizeMousePos();

    if ( STATE.move )
      return;

    if ( STATE.view !== VIEWS.BUILD )
      return;

    // Mousedown on a node
    if ( STATE.state === 'node' ) {

      // left click interactions
      if ( leftClick ) {

        // Move a selected node
        if ( STATE.moved ) {

          STATE.moved = false;

          for ( let i = 0; i < STATE.select.length; i++ ) {
            BOT.nodes[STATE.select[i]].state = MOUSE_EVT.NONE;
          }

          STATE.select = [];
          STATE.hover  = [];

          return;

        }

        // Fix node and links
        const lastNode = BOT.nodes[BOT.nodes.length - 1];
        lastNode.type = NODE_TYPES.NODE;

        if ( !STATE.hover.length ) {

          let mousePosX = MOUSE.normX,
            mousePosY   = MOUSE.normY;

          if ( STATE.shift && BOT.nodes.length >= 2 ) {

            const lastNodeP = BOT.nodes[BOT.nodes.length - 2],
              newPos        = applyNewAngle( lastNodeP.x, lastNodeP.y, mousePosX, mousePosY );

            mousePosX = newPos.x;
            mousePosY = newPos.y;

          }

          lastNode.x = mousePosX;
          lastNode.y = mousePosY;

        } else {

          lastNode.x = BOT.nodes[STATE.hover[0]].x;
          lastNode.y = BOT.nodes[STATE.hover[0]].y;

          let hoverItems = STATE.hover.length;

          // Remove duplicate nodes, this helps in testing phase
          while ( hoverItems-- ) {

            const nodeInd = STATE.hover[hoverItems];

            for ( let l = 0; l < BOT.links.length; l++ ) {

              const currLink = BOT.links[l];

              if ( currLink.node1.x === lastNode.x && currLink.node1.y === lastNode.y )
                currLink.node1 = lastNode;

              if ( currLink.node2.x === lastNode.x && currLink.node2.y === lastNode.y )
                currLink.node2 = lastNode;

            }

            BOT.nodes.splice( nodeInd, 1 );

          }

        }

        // Add preview node
        nodeAdd();

        // Fix links
        const lastLink = BOT.links[BOT.links.length - 1];

        if ( BOT.nodes.length > 2 ) {

          lastLink.node1 = BOT.nodes[BOT.nodes.length - 3];
          lastLink.node2 = BOT.nodes[BOT.nodes.length - 2];

          lastLink.type = LINK_TYPES.LINK;

          // Add new link preview
          linkAdd();

        } else {

          lastLink.node1 = BOT.nodes[BOT.nodes.length - 2];
          lastLink.node2 = BOT.nodes[BOT.nodes.length - 1];

        }


      // We remove nodes if right clicked
      } else if ( rightClick ) {

        // Reverse loop because we need keep the element's index
        let hoverItems = STATE.hover.length;

        while ( hoverItems-- ) {

          const nodeInd = STATE.hover[hoverItems];
          BOT.nodes.splice( nodeInd, 1 );

        }

        STATE.hover  = [];
        STATE.select = [];

      }

    } else if ( STATE.state === 'link' ) {

      // We add a preview link if it exists
      if ( leftClick ) {

        // Reverse loop because we need keep the element's index
        let hoverItems = STATE.hover.length;

        while ( hoverItems-- ) {

          const linkInd = STATE.hover[hoverItems],
            currLink    = BOT.links[linkInd];

          if ( currLink.type === LINK_TYPES.PREVIEW )
            currLink.type = LINK_TYPES.LINK;
          else {

            if ( currLink.type === LINK_TYPES.LINK )
              currLink.type = LINK_TYPES.MUSCLE;
            else if ( currLink.type === LINK_TYPES.MUSCLE )
              currLink.type = LINK_TYPES.LINK;

          }

        }

      // We remove links if right clicked
      } else if ( rightClick ) {

        // Reverse loop because we need keep the element's index
        let hoverItems = STATE.hover.length;

        while ( hoverItems-- ) {

          const linkInd = STATE.hover[hoverItems];
          BOT.links.splice( linkInd, 1 );

        }

        STATE.hover  = [];
        STATE.select = [];

      }

    }

  });

  // Disables right click menu
  canvas?.addEventListener( 'contextmenu', ( evt ) => {
    evt.preventDefault();
  });

  canvas.width  = CANVAS.canvH * devicePixelRatio;
  canvas.height = CANVAS.canvW * devicePixelRatio;

  const resObs = new ResizeObserver( () => {

    canvasPos    = canvas.getBoundingClientRect();
    CANVAS.canvH = canvas.clientWidth;
    CANVAS.canvW = canvas.clientWidth;

    canvas.width  = CANVAS.canvH * devicePixelRatio;
    canvas.height = CANVAS.canvW * devicePixelRatio;

  });

  window.addEventListener( 'resize', () => {
    canvasPos = canvas.getBoundingClientRect();
  });

  resObs.observe( canvas );

  CANVAS.ctx = canvas.getContext( '2d' );

  window.addEventListener( 'keydown', ( evt ) => {

    if ( evt.key === 'Shift' )
      STATE.shift = true;
    else if ( evt.key === ' ' && !STATE.move ) {

      STATE.move = true;
      canvas.style.cursor = 'move';

    }

  });

  window.addEventListener( 'keyup', ( evt ) => {

    if ( evt.key === 'Shift' )
      STATE.shift = false;
    else if ( evt.key === ' ' ) {
      STATE.move = false;
      canvas.style.cursor = 'initial';
    }

  });

}


/**
 * Rendering build view
 */
function renderBuild() {

  const { ctx } = CANVAS;

  if ( ctx === undefined )
    return;

  // LINKS AND MUSCLES
  for( let l = 0; l < BOT.links.length; l++ ) {

    const link = BOT.links[l];

    ctx.beginPath();
    ctx.moveTo( link.node1.x, link.node1.y );
    ctx.lineTo( link.node2.x, link.node2.y );

    ctx.globalAlpha = 1;

    // Muscle
    if ( link.type === LINK_TYPES.MUSCLE ) {

      if ( link.state === MOUSE_EVT.HOVER ) {

        ctx.strokeStyle = '#1F7CEA';
        ctx.lineWidth = 23;
        ctx.stroke();

      }

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 20;
      ctx.stroke();

      ctx.strokeStyle = '#F00';
      ctx.lineWidth = 10;
      ctx.stroke();

    // Link
    } else if ( link.type === LINK_TYPES.LINK ) {

      if ( link.state === MOUSE_EVT.HOVER ) {

        ctx.strokeStyle = '#1F7CEA';
        ctx.lineWidth = 13;
        ctx.stroke();

      }

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 7;
      ctx.stroke();

    // Preview
    } else if ( link.type === LINK_TYPES.PREVIEW ) {

      if ( orig.sel )
        continue;

      ctx.setLineDash([5, 5]);

      ctx.strokeStyle = '#555';
      ctx.lineWidth = 3;
      ctx.stroke();

    }

    ctx.setLineDash([]);

  }

  // NODES
  for( let n = 0; n < BOT.nodes.length; n++ ) {

    const node = BOT.nodes[n];

    if ( node.type === NODE_TYPES.PREVIEW ) {
      ctx.globalAlpha = .4;

      if ( orig.sel )
        continue;

    } else
      ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc( node.x, node.y, 10, 0, 2 * Math.PI );

    if ( node.state === MOUSE_EVT.HOVER ) {

      ctx.lineWidth = 9;
      ctx.strokeStyle = '#1F7CEA';
      ctx.stroke();

    }

    ctx.fillStyle = '#FFF';
    ctx.fill();

    ctx.strokeStyle = '#000';

    if ( node.state === MOUSE_EVT.SELECTED )
      ctx.strokeStyle = '#EA1F1F';

    ctx.lineWidth = 5;
    ctx.stroke();

  }

}


/**
 * Check if a point is inside a circle
 *
 * @param {Number} circX - Circle x center
 * @param {Number} circY - Circle y center
 * @param {Number} rad - Radius
 * @param {Number} x - Point X
 * @param {Number} y - Point Y
 *
 * @returns {Boolean}
 */
function insideCircle( circX, circY, rad, x, y ) {
  return ( Math.pow( ( x - circX ), 2 ) + Math.pow( ( y - circY ), 2 ) <= Math.pow( rad, 2 ) );
}

/**
 * Check if a point is on a line
 *
 * @param {NODE} start - Starting node
 * @param {NODE} end - Ending node
 * @param {Number} [lineThickness=10] - tolearance
 *
 * @returns {Boolean}
 */
function isOnLine( start, end, lineThickness = 10 ) {

  const L2 = ( ( end.x - start.x ) * ( end.x - start.x ) ) +
    ( ( end.y - start.y ) * ( end.y - start.y ) );

  if ( L2 === 0 )
    return false;

  const r = ( ( ( MOUSE.normX - start.x ) * ( end.x - start.x ) ) +
    ( ( MOUSE.normY - start.y ) * ( end.y - start.y ) ) ) / L2;

  // Assume line thickness is circular
  if ( r < 0 ) {

    //Outside start
    return ( Math.sqrt(
        ( ( start.x - MOUSE.normX ) * ( start.x - MOUSE.normX ) ) +
        ( ( start.y - MOUSE.normY ) * ( start.y - MOUSE.normY ) ) ) <=
      lineThickness );

  } else if ( 0 <= r && r <= 1 ) {

    // On the line segment
    const s = ( (
      ( start.y - MOUSE.normY ) * ( end.x - start.x ) ) -
      ( ( start.x - MOUSE.normX ) * ( end.y - start.y ) ) ) / L2;

    return ( Math.abs( s ) * Math.sqrt( L2 ) <= lineThickness );

  } else {
    //Outside end
    return ( Math.sqrt(
        ( ( end.x - MOUSE.normX ) * ( end.x - MOUSE.normX ) ) +
        ( ( end.y - MOUSE.normY ) * ( end.y - MOUSE.normY ) ) ) <=
      lineThickness );
  }
}

/**
 * Adds a preview node
 */
function nodeAdd() {

  BOT.nodes.push({ ...NODE });

  const newNode = BOT.nodes[BOT.nodes.length - 1];
  newNode.x    = MOUSE.normX;
  newNode.y    = MOUSE.normY;

}

/**
 * Adds a preview link
 *
 * @param {NODE} [node1] - Node 1
 * @param {NODE} [node2] - Node 2
 */
function linkAdd( node1, node2 ) {

  BOT.links.push({ ...LINK });

  const currLink = BOT.links[BOT.links.length - 1],
    currNode     = BOT.nodes[BOT.nodes.length - 1];

  if ( node1 !== undefined && node2 !== undefined ) {

    currLink.node1 = node1;
    currLink.node2 = node2;


    return;

  }

  // If there is only 1 node we want to link to that
  if ( BOT.nodes.length === 1 ) {

    currLink.node1 = currNode;
    currLink.node2 = currNode;

  // Otherwise we link to the last two nodes
  } else {

    const penultNode = BOT.nodes[BOT.nodes.length - 2];

    currLink.node1 = penultNode;
    currLink.node2 = currNode;

  }

}


/**
 * Calculates angle at 45 degrees intervals
 * https://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points
 *
 * @param {Number} point1X - point 1 x
 * @param {Number} point1Y - point 1 y
 * @param {Number} point2X - point 2 x
 * @param {Number} point2Y - point 2 y
 *
 * @returns {Object} The point
 */
function applyNewAngle( point1X, point1Y, point2X, point2Y ) {

  const deltaX   = point2X - point1X,
    deltaY       = point2Y - point1Y,
    dist         = Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) ),
    newAngle     = Math.atan2( deltaY, deltaX),
    shiftedAngle = Math.round( newAngle / Math.PI * 4 ) / 4 * Math.PI;

  return {
    x: point1X + dist * Math.cos( shiftedAngle ),
    y: point1Y + dist * Math.sin( shiftedAngle ),
  };
}

/**
 * Setup for change of state
 */
function updateState() {

  STATE.hover  = [];
  STATE.select = [];

  // Remove preview node
  if ( BOT.nodes.length ) {
    if ( BOT.nodes[BOT.nodes.length - 1].type === NODE_TYPES.PREVIEW )
      BOT.nodes.pop();
  }

  // Remove preview link
  if ( BOT.links.length ) {
    if ( BOT.links[BOT.links.length - 1].type === LINK_TYPES.PREVIEW )
      BOT.links.pop();
  }

  // Don't edit the bot
  if ( STATE.view !== VIEWS.BUILD )
    return;

  if ( STATE.state === 'node' ) {

    nodeAdd();
    linkAdd();

  }

}




query( '#export_bot' )?.addEventListener( 'click', ( evt ) => {

  evt.preventDefault();

  const jsonBot = JSON.stringify( BOT ),
    dataUri     = `data:application/json;charset=utf-8,${encodeURIComponent(jsonBot)}`,
    fileName    = `BOT_${Date.now()}.json`,
    linkElement = document.createElement( 'a' );

  linkElement.setAttribute( 'href', dataUri );
  linkElement.setAttribute( 'download', fileName );
  linkElement.click();

  linkElement.remove();

});

query( '#import_bot' )?.addEventListener( 'change', ( evt ) => {

  const reader = new FileReader();

  reader.onload = ( _evt) => {

    const tempBot = JSON.parse( _evt.target.result );

    console.log( 'File loaded!' );
    console.log( tempBot );

    BOT.nodes = tempBot.nodes;
    BOT.links = tempBot.links;

    for ( let n = 0; n < BOT.nodes.length; n++ ) {

      const currNode = BOT.nodes[n];

      for ( let l = 0; l < BOT.links.length; l++ ) {

        const currLink = BOT.links[l];

        if ( currLink.node1.x === currNode.x && currLink.node1.y === currNode.y )
          currLink.node1 = currNode;

        if ( currLink.node2.x === currNode.x && currLink.node2.y === currNode.y )
          currLink.node2 = currNode;

      }
    }

    if ( STATE.state === 'node' ) {

      nodeAdd();
      linkAdd();

    }

    window.dispatchEvent( new CustomEvent( 'evt/botUpload' ) );

    // Reset the input
    query( '#import_bot' ).value = '';

  };

  reader.readAsText( evt.target.files[0]);

});

queryAll( '.bot__import' ).forEach( ( btn )=> {

  btn.addEventListener( 'click', ( evt ) => {

    evt.preventDefault();

    const href = btn.getAttribute( 'href' );

    fetch( href )
      .then( ( resp ) => resp.json() )
      .then( ( tempBot ) => {

        BOT.nodes = tempBot.nodes;
        BOT.links = tempBot.links;

        for ( let n = 0; n < BOT.nodes.length; n++ ) {

          const currNode = BOT.nodes[n];

          for ( let l = 0; l < BOT.links.length; l++ ) {

            const currLink = BOT.links[l];

            if ( currLink.node1.x === currNode.x && currLink.node1.y === currNode.y )
              currLink.node1 = currNode;

            if ( currLink.node2.x === currNode.x && currLink.node2.y === currNode.y )
              currLink.node2 = currNode;

          }
        }

        if ( STATE.state === 'node' ) {

          nodeAdd();
          linkAdd();

        }

        window.dispatchEvent( new CustomEvent( 'evt/botUpload' ) );

      });

  })

});


function buildMain() {

  inputEvents();
  canvasEvts();

}

window.buildMain = buildMain;
window.renderBuild = renderBuild;

}