// makes it easier to convert something to an int
function int(x) {
    return parseInt(x);
}

// makes it easier to convert something to a float
function float(x) {
    return parseFloat(x);
}

// makes it easier to convert something to a string
function str(x) {
    return String(x);
}

// rounds a number to 2 decimal places.
// returns the number in a string form.
function round(x) {
    return ((Math.round(x * 100) / 100).toFixed(2));
}

// adds commas to a number if needed.
// returns the number in a string form.
function comma(x) {
    return x.toLocaleString();
}

// rounds and applies commas to a number. just here so the code is more readable.
// returns a string.
function format(x) {
    return round(str(comma(x)));
}