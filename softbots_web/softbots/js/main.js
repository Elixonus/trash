/**
 * Render the objects
 */
function render() {

  const {
      ctx,
      canvH,
      canvW,
      camera,
    } = CANVAS,
    canW = canvH * devicePixelRatio,
    canH = canvW * devicePixelRatio;

  if ( ctx === undefined ) {
    requestAnimationFrame( render );
    return;
  }

  ctx.save();

  ctx.globalAlpha = 1;

  // BG
  ctx.fillStyle = '#bad7ff';
  ctx.fillRect( 0, 0, canW, canH );
  ctx.translate( canW / 2, canH / 2);
  ctx.scale( 1, -1 );
  ctx.translate( -camera.x, -camera.y );

  // ctx.scale( devicePixelRatio, devicePixelRatio );

  // Floor
  ctx.fillStyle = '#752604';
  ctx.fillRect( canW / -2 + camera.x, 0, canW, canH / -2 + camera.y );

  // Floor line
  ctx.beginPath();
  ctx.moveTo( canW / -2 + camera.x, 0 );
  ctx.lineTo( canW / 2 + camera.x, 0 );
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 20;
  ctx.stroke();

  ctx.scale( devicePixelRatio, devicePixelRatio );

  if ( STATE.view === VIEWS.BUILD )
    renderBuild();
  else if ( STATE.view === VIEWS.TRAIN )
    renderTrain();

  ctx.restore();

  /*
  let image = new Image();
  image.src = "./vignette.png";
  ctx.drawImage(image, 0, 0, canW, canW);
  */

  requestAnimationFrame( render );

}


/**
 * Main function, will be run at page load
 */
(() => {

  buildMain();

  updateInfo();

  requestAnimationFrame( render );

})();

