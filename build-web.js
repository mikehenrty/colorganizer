let colorname = require('color-name');
let colourlib = require('color');
let fs = require('fs');

let colours = process.argv.slice(2);
if (colours.length < 1) {
  colours = Object.keys(colorname).filter(name => {
    if (/^light/.test(name) || /^pale/.test(name) ||
        /^medium/.test(name) || /^dark/.test(name)) {
      return false;
    }
    return true;
  });
}

colours = colours.map(colour => {
  let c = colourlib(colour);
  return {
    name: colour,
    values: c.color
  }
});

let script = `
const SIZE = 8;
const ROTATE_SPEED = 0.3;
const SCALE_SPEED = 0.1;

document.body.style.margin = '0';
document.body.style.backgroundColor = '#1E023F';
document.body.style.fontSize = '2vmin';

let content = document.createElement('div');
content.style.height = '100vmin';
content.style.width = '100vmin';
content.style.backgroundColor = '';
content.style.border = '2px solid white';
content.style.margin = 'auto';
content.style.position = 'relative';
content.style.transformStyle = 'preserve-3d';
document.body.appendChild(content);

let colours = ${JSON.stringify(colours)};

colours.forEach(function (c) {
  let box = document.createElement('div');
  box.style.height = box.style.width = SIZE + 'vmin';
  box.style.backgroundColor = c.name;
  box.style.position = 'absolute';
  let x = Math.round(c.values[0] / 255 * (100 - SIZE));
  let y = Math.round(c.values[2] / 255 * (100 - SIZE));
  let z = Math.round(c.values[1] / 255 * (100 - SIZE) / 2);
  box.style.transform = 'translateX(' + x + 'vmin) ' +
                        'translateY(' + y + 'vmin) ' +
                        'translateZ(' + z + 'vmin)';
  box.textContent = c.name;
  content.appendChild(box);
});

let scale = 0.6;
let perspective = 300;
let rotateX = 60;
let rotateZ = 30;

function setPerspective() {
  content.style.transform = 'scale(' + scale + ') ' +
                            'perspective(' + perspective + 'vmin) ' +
                            'rotateX(' + rotateX + 'deg) ' +
                            'rotateZ(' + rotateZ + 'deg)';
}
setPerspective();

let lastX = 0;
let lastY = 0;
function rotate(evt) {
  let diffX = evt.clientX - lastX;
  lastX = evt.clientX;
  let diffY = evt.clientY - lastY;
  lastY = evt.clientY;

  rotateX -= diffY * ROTATE_SPEED;
  rotateZ -= diffX * ROTATE_SPEED;
  setPerspective();
}

document.body.addEventListener('mousedown', function(evt) {
  lastX = evt.clientX;
  lastY = evt.clientY;
  document.body.addEventListener('mousemove', rotate);
});

document.body.addEventListener('mouseup', function(evt) {
  document.body.removeEventListener("mousemove", rotate);
});

window.addEventListener('wheel', function(evt) {
  perspective += evt.deltaY * SCALE_SPEED;
  setPerspective();
});
`;

fs.writeFileSync('./index.html', `<!doctype html>
<html lang=en>
<head>

<meta charset=utf-8>
<title>Colorganizer</title>
</head>
<body>
  <script>${script}</script></body>
</html>`);

