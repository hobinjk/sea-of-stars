const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;

function initCanvas() {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  return {
    canvas: canvas,
    gfx: canvas.getContext('2d'),
  };
}
const {gfx: base} = initCanvas();
const {gfx: layer, canvas: layerCanvas} = initCanvas();

function drawDot(gfx, x, y, radius, color) {
  gfx.fillStyle = color;
  gfx.beginPath();
  gfx.arc(x, y, radius, 0, 2 * Math.PI);
  gfx.fill();
}

let colorEnabled = false;

function drawDots() {
  base.clearRect(0, 0, width, height);
  layer.clearRect(0, 0, width, height);
  const dotCount = 400;
  for (let i = 0; i < dotCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2 + 4;
    const hue = Math.random() * 360;
    const sat = colorEnabled ? 100 : 0;
    const light = colorEnabled ? 50 : 100;
    let color = `hsla(${hue}, ${sat}%, ${light}%, 0.9)`;

    drawDot(base, x, y, r, color);
    drawDot(layer, x, y, r, color);
  }
}

drawDots();

let mousePressed = false;
let mouseMoved = false;

let scale = 1;
let rotation = 0;
let origin = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

function updateLayerCanvasTransform() {
  layerCanvas.style.transformOrigin = `${origin.x}px ${origin.y}px`;
  layerCanvas.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
}

function onMouseDown(event) {
  event.preventDefault();
  mousePressed = true;
  mouseMoved = false;
}

function onMouseMove(event) {
  if (mousePressed) {
    rotation += event.movementX / 100;
    updateLayerCanvasTransform();
    mouseMoved = true;
  }
}

function onMouseUp(event) {
  event.preventDefault();
  mousePressed = false;
  if (!mouseMoved) {
    colorEnabled = !colorEnabled;
    drawDots();
  }
}

function onWheel(event) {
  scale *= 1 + (event.deltaY / 10000);
  updateLayerCanvasTransform();
}

document.body.addEventListener('wheel', onWheel);
document.body.addEventListener('mousedown', onMouseDown);
document.body.addEventListener('mouseup', onMouseUp);
document.body.addEventListener('mousemove', onMouseMove);
