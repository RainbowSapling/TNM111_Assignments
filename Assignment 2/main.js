
// Canvas settings
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var cWidth = 900;
var cHeight = 900;

c.width = cWidth;
c.height = cHeight;

c.style.background = "#ddf";

ctx.beginPath();
ctx.moveTo(cWidth/2, 0);
ctx.lineTo(cWidth/2, cHeight);
ctx.moveTo(0, cHeight/2);
ctx.lineTo(cWidth, cHeight/2);
ctx.stroke();

// Class thet defines a point
class Point {
    constructor(x, y, type) {
        this.x = x;
        this.y = y,
        this.type = type;
    }
}

// Array that will store all points from the file
var dataPoints = [];

var scaleFactor = 4.0;

// Read a csv file
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            // Split the csv file into an array containing every line in the file
            var splitLines = content.trim().split("\n");
            
            // Go through every line in the file and create a point by extracting the x and y position and the type
            for (i = 0; i < splitLines.length; i++) {
                let temp = splitLines[i].split(",");
                let point = new Point(temp[0], temp[1], temp[2]);

                // Add current point to the array of points
                dataPoints.push(point);
            };
        };
        reader.readAsText(file);
    }
});



let btn = document.querySelector("#drawPoints")
btn.addEventListener("click", function() {

    for (i = 0; i < dataPoints.length; i++) {
        dataPoints[i].x = parseFloat(dataPoints[i].x) * scaleFactor + (cWidth / 2);
        dataPoints[i].y = parseFloat(dataPoints[i].y) * scaleFactor + (cHeight / 2);
    }

    console.log(dataPoints);
    

    for (i = 0; i < dataPoints.length; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        if (dataPoints[i].type == "a" || dataPoints[i].type == "foo") {
            ctx.fillStyle = 'rgb(255, 107, 171)';
            ctx.arc(dataPoints[i].x, dataPoints[i].y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();   
        }
        else if (dataPoints[i].type == "b" || dataPoints[i].type == "baz") {
            ctx.fillStyle = 'rgb(44, 192, 246)';
            ctx.fillRect(dataPoints[i].x, dataPoints[i].y, 10, 10);
            ctx.fill();
            ctx.strokeRect(dataPoints[i].x, dataPoints[i].y, 10, 10); 
        }
        else if (dataPoints[i].type == "c" || dataPoints[i].type == "bar") {
            ctx.fillStyle = 'rgb(178, 8, 197)';
            ctx.moveTo(dataPoints[i].x, parseFloat(dataPoints[i].y) - 5);
            ctx.lineTo(parseFloat(dataPoints[i].x) - 5, parseFloat(dataPoints[i].y) + 5)
            ctx.lineTo(parseFloat(dataPoints[i].x) + 5, parseFloat(dataPoints[i].y) + 5)
            ctx.lineTo(parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y) - 5)
            ctx.fill();
            ctx.stroke();   
        }
        
          
    }    

});

