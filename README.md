# Colorganizer!
Organize colours based on their values.  Accept CSS colour names.

## Running:
You should be able to run the tool by doing:
```
git clone https://github.com/jhford/colorganizer
cd colorganizer
npm install
node index red green blue peachypuff
firefox output.png
```

The arguments provided to the program are the subset of colours which you'd
like to position.  If you call with no arguments to the program, it will use
all named CSS colours.

## Positioning

The default implementation for positioning is to take the 6-byte representation
of the colour and divide it into four sections: red byte, upper green half
byte, lower green half byte and blue byte.  The X coordinate is the sum of the
red byte's decimal value and the decimal value of the upper half of the green
byte after bitshifting it four places right.  The Y coordinate is the sum of
the blue byte's decimal value and the lower half of the green byte.

## Hacking!
You're probably looking to change the positionColour function in.  Otherwise,
fork, hack and open a pull request!

# Naming
Colour is spelled colour.  Every effort has been made to use this correct
spelling.
