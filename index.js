let colorname = require('color-name');
let colourlib = require('color');
let bitwise = require('bitwise');
let Canvas = require('canvas');
let fs = require('fs');


function positionColour(r, g, b) {
  let x = r / 2;
  let y = b / 2;
  let green = bitwise.readByte(g);

  let greenshift = bitwise.and(green, [1,1,1,1,0,0,0,0]);
  greenshift = bitwise.writeByte(greenshift) >> 4;
  console.log(greenshift);

  x += greenshift * 2;
  y += bitwise.writeByte(bitwise.and(green, [0,0,0,0,1,1,1,1])) * 2;

  return {x, y};
}

const SCALE = 4;
const SIZE = SCALE * 10;

let colours = process.argv.slice(2);

if (colours.length < 1) {
  colours = Object.keys(colorname).filter(name => {
    if (/^light/.test(name) || /^pale/.test(name) || /^medium/.test(name) || /^dark/.test(name)) {
      return false;
    }
    return true;
  });
}

console.log('Arrainging colours: ' + colours.join(', '));

colours = colours.map(colour => {
  let c = colourlib(colour);
  return {
    name: colour,
    values: c.color
  }
});

Image = Canvas.Image;

let width = 300 * SCALE + SIZE + SCALE * 75;
let height = 300 * SCALE + SIZE + 50;

canvas = new Canvas(width, height);
ctx = canvas.getContext('2d');
ctx.style = 'black';
ctx.fillRect(0,0,width,height);

for (let colour of colours) {
  let position = positionColour(colour.values[0], colour.values[1], colour.values[2]);
  let x = position.x;
  let y = position.y;

  console.log(colour.name + ' @ ' + x + ', ' + y);

  let drawXAt = x + SIZE/2;
  let drawYAt = y + SIZE/2;

  ctx.fillStyle = colour.name;
  ctx.fillRect(drawXAt*SCALE,drawYAt*SCALE,SIZE,SIZE);
  let label = colour.name;
  if (process.env.SHOW_COORDS) {
    label = colour.name + ' X: ' + x + ' Y: ' + y;
  }
  ctx.fillStyle = 'white';
  ctx.fillText(label, drawXAt*SCALE + SIZE, drawYAt*SCALE + SIZE);
}

let output = fs.createWriteStream('output.png');

let pngStream = canvas.pngStream();

pngStream.pipe(output);

pngStream.on('end', () => { console.log('done') });

