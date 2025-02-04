
// Canvas settings
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var cWidth = 900;
var cHeight = 900;

c.width = cWidth;
c.height = cHeight;

c.style.background = "#ddf";



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

var containsNegative = false;

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






// Button that prints out data
let btn = document.querySelector("#drawPoints")
btn.addEventListener("click", function() {

    // Check if the dataset contains negative values
    for (i = 0; i < dataPoints.length; i++) {
        if (parseFloat(dataPoints[i].x) < 0) {
            containsNegative = true;
            break;
        }
        else if (parseFloat(dataPoints[i].y) < 0) {
            containsNegative = true;
            break;
        }
    }

    // Variables to help calculate scaling
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
   
    // Find largest and smalles values in dataset
    for (i = 0; i < dataPoints.length; i++) {
        if(parseFloat(dataPoints[i].x) > maxX) {maxX = parseFloat(dataPoints[i].x)}
        if(parseFloat(dataPoints[i].x) < minX) {minX = parseFloat(dataPoints[i].x)}
        if(parseFloat(dataPoints[i].y) > maxY) {maxY = parseFloat(dataPoints[i].y)}
        if(parseFloat(dataPoints[i].y) < minY) {minY = parseFloat(dataPoints[i].y)}
    }
   
    // Find largest absolute value, which will be used for scaling
    var biggestValue = Math.max(maxX, maxY, Math.abs(minX), Math.abs(minY));

    if (containsNegative == true) {
        // Calculate scale factor (+5 to avoid points being drawn right at the edge)
        var scaleFactorNeg = (cWidth/2) / (biggestValue + 5);
        
        //Draw axis that has both positive and negative values
        ctx.beginPath();
        ctx.lineWidth = 2.0;
        ctx.moveTo(cWidth/2, 0);
        ctx.lineTo(cWidth/2, cHeight);
        ctx.moveTo(0, cHeight/2);
        ctx.lineTo(cWidth, cHeight/2);
        ctx.stroke();

        // Move points to origin and scale
        for (i = 0; i < dataPoints.length; i++) {
            dataPoints[i].x = parseFloat(dataPoints[i].x) * scaleFactorNeg + (cWidth / 2);
            dataPoints[i].y = parseFloat(-dataPoints[i].y) * scaleFactorNeg + (cHeight / 2); // Invert y-axis so that positive values are up and negative down
        }
    }
    else {
        // Calculate scale factor (+5 to avoid points being drawn right at the edge)
        var scaleFactorPos = cWidth / (biggestValue + 5);
        
        // Draw axis that only have positive values
        ctx.beginPath();
        ctx.lineWidth = 4.0;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, cHeight);
        ctx.lineTo(cWidth, cHeight);
        ctx.stroke();

        // Move points to origin and scale
        for (i = 0; i < dataPoints.length; i++) {
            dataPoints[i].x = parseFloat(dataPoints[i].x) * scaleFactorPos;
            dataPoints[i].y = parseFloat(-dataPoints[i].y) * scaleFactorPos + cHeight; // Invert y-axis so that positive values are up and negative down
        }
    }







    

    // Draw points
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

