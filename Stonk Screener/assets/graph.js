// customization variables
let graph_x = 100;
let graph_y = 40;
let graph_l = 1090;
let graph_h = 390;
let graph_t = 10;
let x_nodes = 20;
let ynodes = 10;
let node_length = 10;
let x_font_size = 18;
let y_font_size = 12;



// This function declares p variables and more for an object.
// p variables are used for collision detection.
function importPvars(item) {
    item.hl = item.l / 2;
    item.hh = item.h / 2;
    item.cx = item.x + item.hl;
    item.cy = item.y + item.hh;
    item.p1x = item.x;
    item.p1y = item.y;
    item.p2x = item.x + item.l;
    item.p2y = item.y;
    item.p3x = item.x;
    item.p3y = item.y + item.h;
    item.p4x = item.x + item.l;
    item.p4y = item.y + item.h;
}

// This function refreshes the p vars of an object to their correct values.
function refreshPvars(a) {
    a.hl = a.l / 2;
    a.hh = a.h / 2;
    a.cx = a.x + a.hl;
    a.cy = a.y + a.hh;
    a.p1x = a.x;
    a.p1y = a.y;
    a.p2x = a.x + a.l;
    a.p2y = a.y;
    a.p3x = a.x;
    a.p3y = a.y + a.h;
    a.p4x = a.x + a.l;
    a.p4y = a.y + a.h;
}

// Helper method for the collisionWith() method.
function overlap(p1, p2) {
    return p1[0] <= p2[1] && p1[1] >= p2[0];
}
// This function is used to check whether or not a collision between two objects is happening.
// The two objects can be in either a or b.
function collisionWith(a, b) {
    const aX = [a.p1x, a.p2x];
    const aY = [a.p1y, a.p3y];
    const bX = [b.p1x, b.p2x];
    const bY = [b.p1y, b.p3y];
  
    return (
        overlap(aX, bX) &&
        overlap(aY, bY) &&
        (overlap([a.p1x, a.p2x], [b.p1x, b.p2x]) ||
            overlap([a.p1y, a.p3y], [b.p1y, b.p3y]))
    );
}

function rect(x, y, length, height, r, g, b, opacity, angle) {
    ctx.save();
    ctx.translate(x+(length/2), y+(height/2));
    ctx.rotate(angle * Math.PI / 180);
    ctx.lineWidth = 1;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.beginPath();
    ctx.rect(length/-2, height/-2, length, height);
    ctx.fill();
    ctx.restore();
}

function circle(x,y,radius,r,g,b,opacity) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.fill();
}

function line(x1, y1, x2, y2, r, g, b, opacity, width) {
    ctx.save();
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

function text(message, font, x, y, r, g, b, size, alignment, opacity) {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.textAlign = String(alignment);
    ctx.font = (String(size) + "px " + String(font));
    ctx.fillText(String(message), x, y);
}

// gets the max int in a list
function getMax(thedata) {
    let max = thedata[0];
    for (var i=0;i<thedata.length;i++) {
        if (float(thedata[i]) > float(max)) {
            max = thedata[i];
        }
    }
    return max;
}

// gets the min int in a list
function getMin(thedata) {
    let min = thedata[0];
    for (var i=0;i<thedata.length;i++) {
        if (float(thedata[i]) < float(min)) {
            min = thedata[i];
        }
    }
    return min;
}

// this function is used to correctly get the real y position, because the relative
// position for the graph can be skewed due to moving around and such
function graphPoint(pos) {
    return (graph_y+(graph_h-graph_t)) - ((pos - minnum) * pixelsPerUnit);
}

// takes x pixels and converts them to graph units.
function pixelsToUnits(x) {
    return x * unitsPerPixel;
}

// takes x units and converts them to pixels.
function unitsToPixels(x) {
    return x * pixelsPerUnit;
}

// gets roughly evenly spaced points because there can be a lot of points sometimes
function getKeyPoints(data,nodes) {
    const length = data.length;
    const step = Math.floor(length / (nodes - 1));
    const keyPoints = [];

    for (let i = 0; i < nodes - 1; i++) {
        const index = Math.min(i * step, length - 1);
        keyPoints.push(data[index]);
    }
    keyPoints.push(data[length - 1]);
    return keyPoints;
}

// 20 nodes max for best look
// 100 data points as well

let data = [];

// takes in data from detail.html and puts it into the correct format for the graph
function giveData(head,src) {
    data = [];
    for (var i=0;i<src.length;i++) {
        data.push([head[i],src[i][3]]);
    }
    setUp();
}

let xnodes = 0;
// this function sets everything up with new data.
function setUp() {
    xnodes = x_nodes;
    if (xnodes > data.length) {
        xnodes = data.length;
    }
    if (xnodes > 20) {
        xnodes = 20;
    }
    
    xdata = [];
    ydata = [];
    for (var i=0;i<data.length;i++) {
        xdata.push(data[i][0]);
        ydata.push(round(data[i][1]));
    }
    
    maxnum = getMax(ydata);
    minnum = getMin(ydata);
    thedif = maxnum - minnum;
    
    unitsPerPixel = thedif / ypixels; // should be 0.17105263157894737
    pixelsPerUnit = ypixels / thedif; // should be 5.846153846153846
    
    points = [];
    makePoints();
    nodes = [];
    makeNodes();
}

let xdata = [];
let ydata = [];

let maxnum = getMax(ydata);
let minnum = getMin(ydata);
let thedif = maxnum - minnum;

const xpixels = graph_l - graph_t;
const ypixels = graph_h - graph_t;

let unitsPerPixel = thedif / ypixels; // should be 0.17105263157894737
let pixelsPerUnit = ypixels / thedif; // should be 5.846153846153846

points = [];
// creating all of the points on the graph
function makePoints() {
    let xpos = graph_x+(graph_t/2);
    for (var i=0;i<data.length;i++) {
        points.push(new Point(xpos,graphPoint(data[i][1]),xdata[i],ydata[i]));
        xpos += xpixels / (data.length-1);
    }
}

nodes = [];
// creating the ticks for the x and y axis of the graph
function makeNodes() {
    let movedist = null;
    let pos = null;

    movedist = (xpixels * (xnodes / (xnodes-1))) / xnodes;
    pos = graph_x;
    let keypoints = getKeyPoints(xdata,xnodes);
    for (var i=0;i<xnodes;i++) {
        nodes.push(new Node(pos,graph_y+graph_h,keypoints[i],0));
        pos += movedist;
    }

    movedist = (ypixels * (ynodes / (ynodes-1))) / ynodes;
    pos = graph_y;
    for (var i=ynodes-1;i>=0;i--) {
        nodes.push(new Node(graph_x-node_length,pos,round(maxnum - pixelsToUnits(pos-graph_y)),1));
        pos += movedist;
    }
}

class Graph {

    constructor() {
      this.interval = setInterval(()=>this.update(), (1000 / 60));
      makePoints();
      makeNodes();
    }

    update() {

        // updating mouse position
        mouse.x = mousex;
        mouse.y = mousey;
        refreshPvars(mouse);

        // highlighting points touching the mouse
        for (var i=0;i<points.length;i++) {
            if (collisionWith(mouse,points[i].hitbox)) {
                points[i].highlight = true;
                for (var j=0;j<points.length;j++) {
                    if (points[j] != points[i] && points[j].highlight) {
                        points[j].highlight = false;
                    }
                }
            } else {
                points[i].highlight = false;
            }
        }
        for (var i=0;i<buttons.length;i++) {
            if (collisionWith(buttons[i],mouse)) {
                buttons[i].highlight = true;
            } else {
                buttons[i].highlight = false;
            }
        }

        // refreshing screen
        ctx.clearRect(0,0,cvas.width,cvas.height);

        // drawing graph lines
        rect(graph_x,graph_y,graph_t,graph_h,0,0,0,1,0);
        rect(graph_x,graph_y+ypixels,graph_l,graph_t,0,0,0,1,0);

        // drawing graph zone
        rect(graph_x+graph_t,graph_y,graph_l-graph_t,graph_h-graph_t,173,173,173,1,0);

        text(stockname,"Trebuchet MS",130,540,255,255,255,54,"center",1);

        let percentchange = 0;
        try {
            let ratio = data[data.length-1][1] / data[0][1];
            if (ratio > 1) {
                percentchange = round(100 * (ratio - 1));
            } else if (ratio < 1) {
                percentchange = round(100 * ((1 - (ratio)) * -1));
            } else {
                percentchange = 0.00;
            }
        } catch {
            true;
        }

        if (percentchange > 0) {
            text("+" + comma(float(percentchange)) + "%","Trebuchet MS",1160,540,0,200,0,36,"center",1);
        } else if (percentchange < 0) {
            text("" + comma(float(percentchange)) + "%","Trebuchet MS",1160,540,200,0,0,36,"center",1);
        } else {
            text("=" + comma(float(percentchange)) + "%","Trebuchet MS",1160,540,200,200,0,36,"center",1);
        }

        // drawing nodes
        for (var i=0;i<nodes.length;i++) {
            nodes[i].drawNode();
        }
        // drawing points
        for (var i=0;i<points.length;i++) {
            points[i].drawPoint(i);
        }
        // drawing buttons
        for (var i=0;i<buttons.length;i++) {
            buttons[i].drawButton();
        }
        // drawing stats for highlighted point
        for (var i=0;i<points.length;i++) {
            if (points[i].highlight) {
                rect(points[i].x-50,points[i].y-60,100,50,44,44,44,0.75,0);
                text("$" + points[i].data,"Arial",points[i].x,points[i].y-18,255,255,255,18,"center",1);
                text(points[i].info,"Arial",points[i].x,points[i].y-40,255,255,255,18,"center",1);
            }
        }

    }

}

class Point {
    constructor(x,y,info,data) {
        this.x = x;
        this.y = y;
        this.info = info;
        this.data = data;
        this.hitbox = {
            x: this.x-10,
            y: this.y-10,
            l: 20,
            h: 20
        }
        importPvars(this.hitbox);
        this.highlight = false;
        this.ptadd = 100;
        this.pt = 0;
    }
    drawPoint(i) {
        if (this.highlight) {
            this.pt = this.ptadd;
        } else {
            this.pt = 0;
        }
        try {
            if (data[0][1] > data[data.length-1][1]) {
                line(this.x,this.y,points[i+1].x,points[i+1].y,200,0,0,1,3);
            } else if (data[0][1] < data[data.length-1][1]) {
                line(this.x,this.y,points[i+1].x,points[i+1].y,0,200,0,1,3);
            } else {
                line(this.x,this.y,points[i+1].x,points[i+1].y,173,173,0,1,3);
            }
        } catch {
            true;
        }
        if (this.highlight) {
            if (data[0][1] > data[data.length-1][1]) {
                circle(this.x,this.y,5,200+this.pt,0,0,1);
            } else if (data[0][1] < data[data.length-1][1]) {
                circle(this.x,this.y,5,0,200+this.pt,0,1);
            } else {
                circle(this.x,this.y,5,173+this.pt,173+this.pt,0,1);
            }
        }
    }
}

class Node {
    constructor(x,y,value,type) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.type = type;
        switch(this.type) {
            case 0: // x node
                this.l = graph_t;
                this.h = node_length;
                break;
            case 1: // y node
                this.l = node_length;
                this.h = graph_t;
                break;
        }
    }
    drawNode() {
        switch(this.type) {
            case 0: // x node
                rect(this.x,this.y,this.l,this.h,0,0,0,1,0);
                text(this.value,"Trebuchet MS",this.x+(graph_t/2),this.y+node_length+y_font_size,255,255,255,y_font_size,"center",1);
                break;

            case 1: // y node
                rect(this.x,this.y,this.l,this.h,0,0,0,1,0);
                text(this.value,"Trebuchet MS",this.x-node_length,this.y+(x_font_size/2),255,255,255,x_font_size,"right",1);
                break;
        }
    }
}

class Button {
    constructor(x,y,type) {
        this.x = x;
        this.y = y;
        this.l = 100;
        this.h = 50;
        this.type = type;
        this.highlight = false;
        this.clicked = false;
        importPvars(this);
    }
    clickButton() {
        if (this.clicked == false) {
            this.clicked = true;
            switch(this.type) {
                case "5d":
                    getStockPast("5d");
                    break;
                case "1mo":
                    getStockPast("1mo");
                    break;
                case "6mo":
                    getStockPast("6mo");
                    break;
                case "YTD":
                    getStockPast("YTD");
                    break;
                case "1y":
                    getStockPast("1y");
                    break;
                case "5y":
                    getStockPast("5y");
                    break;
                case "Max":
                    getStockPast("Max");
                    break;
            }
        }
    }
    drawButton() {
        rect(this.x-5,this.y-5,this.l+10,this.h+10,0,0,0,1,0);
        if (this.highlight == false) {
            rect(this.x,this.y,this.l,this.h,100,100,100,1,0);
            if (this.clicked) {
                text(this.type,"Trebuchet MS",this.cx,this.cy+12,0,173,255,36,"center",1);
            } else {
                text(this.type,"Trebuchet MS",this.cx,this.cy+12,200,200,200,36,"center",1);
            }
        } else {
            rect(this.x,this.y,this.l,this.h,155,155,155,1,0);
            if (this.clicked) {
                text(this.type,"Trebuchet MS",this.cx,this.cy+12,0,173,255,36,"center",1);
            } else {
                text(this.type,"Trebuchet MS",this.cx,this.cy+12,255,255,255,36,"center",1);
            }
        }
    }
}
buttons = [];
buttons.push(new Button(357-75,500,"5d"));
buttons[0].clicked = true;
buttons.push(new Button(457-75,500,"1mo"));
buttons.push(new Button(562-75,500,"6mo"));
buttons.push(new Button(667-75,500,"YTD"));
buttons.push(new Button(772-75,500,"1y"));
buttons.push(new Button(877-75,500,"5y"));
buttons.push(new Button(982-75,500,"Max"));

mouse = {
    x: mousex,
    y: mousey,
    l: 1,
    h: 1
}
importPvars(mouse);

const graph = new Graph();