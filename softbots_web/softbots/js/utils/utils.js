const
  MOUSE_EVT = {
    NONE:     0,
    SELECTED: 1,
    HOVER:    2,
  },

  NODE_TYPES = {
    NODE:    0,
    PREVIEW: 1,
  },
  NODE = {
    type: NODE_TYPES.PREVIEW,
    state: MOUSE_EVT.NONE,
    x:    0,
    y:    0,
  },

  LINK_TYPES = {
    LINK:    0,
    MUSCLE:  1,
    PREVIEW: 2,
  },
  LINK = {
    type:  LINK_TYPES.PREVIEW,
    state: MOUSE_EVT.NONE,
    node1: {...NODE},
    node2: {...NODE},
  },

  BOT = {
    nodes:   [{...NODE}],
    links:   [{...LINK}],
  },

  MOUSE = {
    normX: 0, // mouse x from -1 to 1
    normY: 0, // mouse y from -1 to 1
    x:     0,
    y:     0,
  },
  VIEWS = {
    BUILD: 0,
    TRAIN: 1,
  },
  STATE = {
    state:  query( 'input[name="state"]:checked' )?.value,
    view:   setView(),
    /** @type {Array.<Number>} */
    hover:  [],
    /** @type {Array.<Number>} */
    select: [],
    moved:  false,
    mouseD: false,
    shift:  false,
    move:   false,
  },
  CANVAS = {
    /** @type {HTMLCanvasElement|any} */
    canvas: query( '#canvas' ),
    canvH:  0,
    canvW:  0,
    camera: {
      x: 0,
      y: 200,
    },
    /** @type {CanvasRenderingContext2D|undefined} */
    ctx:    undefined,
  };

/**
 * Shorthand for document.querySelector
 *
 * @param {String} el - Element
 * @param {HTMLElement|Document} parent - parent node (document by default)
 *
 * @returns {HTMLElement|null}
 */
function query( el, parent = document ) {
  return parent.querySelector( el );
}

/**
 * Shorthand for document.querySelector
 *
 * @param {String} el - Element
 * @param {HTMLElement|Document} parent - parent node (document by default)
 *
 * @returns {NodeList|Array}
 */
function queryAll( el, parent = document ) {
  return parent.querySelectorAll( el );
}

/**
 * Sets the view state
 *
 * @returns {Number} VIEWS state
 */
 function setView() {

  const inpView = query( 'input[name="view"]:checked' )?.value;

  if ( inpView === 'build' )
    return VIEWS.BUILD;
  else if ( inpView === 'train' )
    return VIEWS.TRAIN;

  // Fallback to build state
  return VIEWS.BUILD;

}


/**
 * Updates state info
 */
function updateInfo() {

  const stateInfo = query( '#state_info' );

  if ( stateInfo === null )
    return;

  let info = '';

  info += `Current state: ${JSON.stringify( STATE, null, 2 )}\n\n`;
  // info += `Current view: ${STATE.view}\n\n`;
  info += `Mouse pos:\n x: ${MOUSE.x} \n y: ${MOUSE.y}\n\n`;
  info += `Norm. mouse pos:\n x: ${MOUSE.normX.toFixed( 2 )} \n y: ${MOUSE.normY.toFixed( 2 )}\n\n`;
  // info += `Bot info: ${JSON.stringify( BOT, null, 2 )}\n\n`;

  stateInfo.textContent = info;

}

/**
 * Normalizes a value from one range (current) to another (new).
 *
 * @param {Number} val    - the current value (part of the current range).
 * @param {Number} minVal - the min value of the current value range.
 * @param {Number} maxVal - the max value of the current value range.
 * @param {Number} newMin - the min value of the new value range.
 * @param {Number} newMax - the max value of the new value range.
 *
 * @returns {Number} the normalized value.
 */
function normalizeBetweenTwoRanges( val, minVal, maxVal, newMin, newMax ) {
  return newMin + (val - minVal) * (newMax - newMin) / (maxVal - minVal);
}

/**
 * Nomralizes mouse position isde the canvas
 */
function normalizeMousePos() {

  const {
    canvas,
    camera,
  } = CANVAS;

  MOUSE.normX = normalizeBetweenTwoRanges(
    MOUSE.x,
    0,
    CANVAS.canvW,
    ( canvas.width / devicePixelRatio / -2 ) + camera.x,
    ( canvas.width / devicePixelRatio /  2 ) + camera.x
  );

  MOUSE.normY = normalizeBetweenTwoRanges(
    MOUSE.y,
    0,
    CANVAS.canvH,
    ( canvas.height / devicePixelRatio /  2 ) + ( camera.y / devicePixelRatio ),
    ( canvas.height / devicePixelRatio / -2 ) + ( camera.y / devicePixelRatio )
  );

}