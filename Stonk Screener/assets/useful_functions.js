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
function format(num) {
    // convert num to a number if it's a string
    if (typeof num === 'string') {
        num = parseFloat(num);
    }
    // check if num is a valid number
    if (isNaN(num)) {
        return "Invalid input";
    }
    // round to two decimal places
    num = num.toFixed(2);

    // add commas for thousands separator
    num = parseFloat(num).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    return num;
}