
// Canvas settings
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var cWidth = 900;
var cHeight = 900;

c.width = cWidth;
c.height = cHeight;

c.style.background = 'rgb(255, 255, 255)';

// Legend settings

var l = document.getElementById("legend");
var lx = l.getContext("2d");

var lWidth = 100;
var lHeight = 150;

l.width = lWidth;
l.height = lHeight;

l.style.background = 'rgb(255, 255, 255)';

// Class thet defines a point
class Point {
    constructor(x, y, xOriginal, yOriginal, type, radius) {
        this.x = x;
        this.y = y,
        this.xOriginal = xOriginal;
        this.yOriginal = yOriginal;
        this.type = type;
        this.radius = radius;
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
                let point = new Point(temp[0], temp[1], temp[0], temp[1], temp[2], 5);

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
        ctx.lineWidth = 3.0;
        ctx.moveTo(cWidth/2, 0);
        ctx.lineTo(cWidth/2, cHeight);
        ctx.moveTo(0, cHeight/2);
        ctx.lineTo(cWidth, cHeight/2);
        ctx.stroke();

        // Draw grid
        let gridNumber;
        //x
        for (i = 50; i < cWidth; i+=50) {
            // Grid lines
            ctx.beginPath();
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.lineWidth = 1.0;
            ctx.moveTo(i, 0);
            ctx.lineTo(i, cHeight);
            ctx.stroke();
            // Ticks on axis
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.lineWidth = 3.0;
            ctx.moveTo(i, (cHeight/2) - 10);
            ctx.lineTo(i, (cHeight/2) + 10);
            ctx.stroke();
            // Numbers
            ctx.beginPath();
            ctx.fillStyle = 'rgb(205, 0, 0)';
            ctx.font = "14px Arial";
            gridNumber = ((i - 450) / scaleFactorNeg).toFixed(1);
            ctx.fillText(gridNumber, i - 15, (cHeight/2) + 25);
            ctx.stroke();
        }
        ctx.moveTo(0,50);
        // y
        for (i = 50; i < cWidth; i+=50) {
            // Grid lines
            ctx.beginPath();
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.lineWidth = 1.0;
            ctx.moveTo(0, i);
            ctx.lineTo(cWidth, i);
            ctx.stroke();
            // Ticks on axis
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.lineWidth = 3.0;
            ctx.moveTo((cWidth/2) - 10, i);
            ctx.lineTo((cWidth/2) + 10, i);
            ctx.stroke();
            // Numbers
            ctx.beginPath();
            ctx.fillStyle = 'rgb(205, 0, 0)';
            ctx.font = "14px Arial";
            gridNumber = -1 * ((i - 450) / scaleFactorNeg).toFixed(1);
            ctx.fillText(gridNumber, (cWidth/2) + 15, i + 5);
            ctx.stroke();
        }
        

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

        // Draw grid
        let gridNumber;
        //x
        for (i = 50; i < cWidth; i+=50) {
            // Grid lines
            ctx.beginPath();
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.lineWidth = 1.0;
            ctx.moveTo(i, 0);
            ctx.lineTo(i, cHeight);
            ctx.stroke();
            // Ticks on axis
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.lineWidth = 3.0;
            ctx.moveTo(i, cHeight - 10);
            ctx.lineTo(i, cHeight);
            ctx.stroke();
            // Numbers
            ctx.beginPath();
            ctx.fillStyle = 'rgb(205, 0, 0)';
            ctx.font = "14px Arial";
            gridNumber = (i / scaleFactorPos).toFixed(1);
            ctx.fillText(gridNumber, i - 15, cHeight - 20);
            ctx.stroke();
        }
        ctx.moveTo(0,50);
        // y
        for (i = 50; i < cWidth; i+=50) {
            // Grid lines
            ctx.beginPath();
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.lineWidth = 1.0;
            ctx.moveTo(0, i);
            ctx.lineTo(cWidth, i);
            ctx.stroke();
            // Ticks on axis
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.lineWidth = 3.0;
            ctx.moveTo(0, i);
            ctx.lineTo(10, i);
            ctx.stroke();
            // Numbers
            ctx.beginPath();
            ctx.fillStyle = 'rgb(205, 0, 0)';
            ctx.font = "14px Arial";
            gridNumber = ((900 - i) / scaleFactorPos).toFixed(1);
            ctx.fillText(gridNumber, 15, i + 5);
            ctx.stroke();
        }

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
        if (dataPoints[i].type == "a" || dataPoints[i].type == "foo" || dataPoints[i].type == "a\r" || dataPoints[i].type == "foo\r") {
            ctx.fillStyle = 'rgb(255, 107, 171)';
            ctx.arc(dataPoints[i].x, dataPoints[i].y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();   
        }
        else if (dataPoints[i].type == "b" || dataPoints[i].type == "baz" || dataPoints[i].type == "b\r" || dataPoints[i].type == "baz\r") {
            ctx.fillStyle = 'rgb(44, 192, 246)';
            ctx.fillRect(dataPoints[i].x, dataPoints[i].y, 10, 10);
            ctx.fill();
            ctx.strokeRect(dataPoints[i].x, dataPoints[i].y, 10, 10); 
        }
        else if (dataPoints[i].type == "c" || dataPoints[i].type == "bar" || dataPoints[i].type == "c\r" || dataPoints[i].type == "bar\r") {
            ctx.fillStyle = 'rgb(178, 8, 197)';
            ctx.moveTo(dataPoints[i].x, parseFloat(dataPoints[i].y) - 5);
            ctx.lineTo(parseFloat(dataPoints[i].x) - 5, parseFloat(dataPoints[i].y) + 5)
            ctx.lineTo(parseFloat(dataPoints[i].x) + 5, parseFloat(dataPoints[i].y) + 5)
            ctx.lineTo(parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y) - 5)
            ctx.fill();
            ctx.stroke();   
        }    
    }    

    // Add data to legend
    var type1;
    var type2;
    var type3;

    if (containsNegative) {
        type1 = "a";
        type2 = "b";
        type3 = "c";
    }
    else {
        type1 = "foo";
        type2 = "baz";
        type3 = "bar";
    }

    lx.beginPath();
    lx.lineWidth = 1.0;
    lx.fillStyle = 'rgb(255, 107, 171)';
    lx.arc(25, 45, 5, 0, 2 * Math.PI);
    lx.fill();
    lx.fillStyle = 'rgb(0, 0, 0)';
    lx.font = "15px Arial";
    lx.fillText("= " + type1, 35, 50);
    lx.stroke();   
        
    lx.beginPath();
    lx.lineWidth = 1.0;
    lx.fillStyle = 'rgb(44, 192, 246)';
    lx.fillRect(20, 80, 10, 10);
    lx.fill();
    lx.fillStyle = 'rgb(0, 0, 0)';
    lx.font = "15px Arial";
    lx.fillText("= " + type2, 35, 90);
    lx.strokeRect(20, 80, 10, 10); 
            
    lx.beginPath();
    lx.lineWidth = 1.0;        
    lx.fillStyle = 'rgb(178, 8, 197)';
    lx.moveTo(25, 120);
    lx.lineTo(20, 130)
    lx.lineTo(30, 130)
    lx.lineTo(25, 120)
    lx.fill();
    lx.fillStyle = 'rgb(0, 0, 0)';
    lx.font = "15px Arial";
    lx.fillText("= " + type3, 35, 130);
    lx.stroke(); 

});


// Define a mouse
var mouse = { x:0, y:0};

// Find mouse position on screen
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    
}

// Variable used for checking if a pont has alredy been clicked
var lastPoint = new Point(0,0,0,0,"a",5);

//-----------------------------------------------Quadrant------------------------------------------------------------------

// When mose is clicked assign new coloras based on quadrant
window.addEventListener("click", function(e) {
    // Find mouse position
    var mousePos = getMousePos(c, e);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    console.log(mouse);

    var minDist = Infinity;
    var dist = 0;
    var closestPoint;
    var clickRadius = 5;
    

    for (i = 0; i < dataPoints.length; i++) {
        // Find distance between current point and mouse pos
        dist = Math.sqrt((mouse.x - dataPoints[i].x) * (mouse.x - dataPoints[i].x) + (mouse.y - dataPoints[i].y) * (mouse.y - dataPoints[i].y));

        // Find closest point to the clicked position
        if (dist < minDist) {
            minDist = dist;
            closestPoint = dataPoints[i];
        }
    }

    // Check if a point is already selected
    if (lastPoint != closestPoint) { // New point is clicked
        lastPoint = closestPoint;

        // Check if clicked position is close enought to a point
        if(minDist <= closestPoint.radius + clickRadius) {

            for(i = 0; i < dataPoints.length; i++) {

                var pColor;
            
                // Define differet colors for the quadrants
                // Upper left
                if (dataPoints[i].x < closestPoint.x && dataPoints[i].y > closestPoint.y) {
                    pColor = 'rgb(210, 30, 30)';
                }
                // Upper right
                else if (dataPoints[i].x > closestPoint.x && dataPoints[i].y > closestPoint.y) {
                    pColor = 'rgb(80, 7, 125)';
                }
                // Lower left
                else if (dataPoints[i].x < closestPoint.x && dataPoints[i].y < closestPoint.y) {
                    pColor = 'rgb(19, 54, 171)';
                }
                // Lower right
                else if (dataPoints[i].x > closestPoint.x && dataPoints[i].y < closestPoint.y){
                    pColor = 'rgb(241, 123, 20)';
                }
         
            
                // Redraw the points with new colors
                ctx.beginPath();
                ctx.lineWidth = 1.0;
           
                // Highlight the point which is the new origin
                if (dataPoints[i] == closestPoint) {
                    //ctx.lineWidth = 3.0;
                    pColor = 'rgb(20, 241, 108)';
                }

                ctx.fillStyle = pColor;

                // Draw the points
                if (dataPoints[i].type == "a" || dataPoints[i].type == "foo" || dataPoints[i].type == "a\r" || dataPoints[i].type == "foo\r") {
                    ctx.arc(dataPoints[i].x, dataPoints[i].y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();   
                }
                else if (dataPoints[i].type == "b" || dataPoints[i].type == "baz" || dataPoints[i].type == "b\r" || dataPoints[i].type == "baz\r") {
                    ctx.fillRect(dataPoints[i].x, dataPoints[i].y, 10, 10);
                    ctx.fill();
                    ctx.strokeRect(dataPoints[i].x, dataPoints[i].y, 10, 10); 
                }
                else if (dataPoints[i].type == "c" || dataPoints[i].type == "bar" || dataPoints[i].type == "c\r" || dataPoints[i].type == "bar\r") {
                    ctx.moveTo(dataPoints[i].x, parseFloat(dataPoints[i].y) - 5);
                    ctx.lineTo(parseFloat(dataPoints[i].x) - 5, parseFloat(dataPoints[i].y) + 5)
                    ctx.lineTo(parseFloat(dataPoints[i].x) + 5, parseFloat(dataPoints[i].y) + 5)
                    ctx.lineTo(parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y) - 5)
                    ctx.fill();
                    ctx.stroke();   
                }
            }
        }
    }
    else { // Same point is clicked again
        // Draw points and reset the colors
        for (i = 0; i < dataPoints.length; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1.0;
            if (dataPoints[i].type == "a" || dataPoints[i].type == "foo" || dataPoints[i].type == "a\r" || dataPoints[i].type == "foo\r") {
                ctx.fillStyle = 'rgb(255, 107, 171)';
                ctx.arc(dataPoints[i].x, dataPoints[i].y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();   
            }
            else if (dataPoints[i].type == "b" || dataPoints[i].type == "baz" || dataPoints[i].type == "b\r" || dataPoints[i].type == "baz\r") {
                ctx.fillStyle = 'rgb(44, 192, 246)';
                ctx.fillRect(dataPoints[i].x, dataPoints[i].y, 10, 10);
                ctx.fill();
                ctx.strokeRect(dataPoints[i].x, dataPoints[i].y, 10, 10); 
            }
            else if (dataPoints[i].type == "c" || dataPoints[i].type == "bar" || dataPoints[i].type == "c\r" || dataPoints[i].type == "bar\r") {
                ctx.fillStyle = 'rgb(178, 8, 197)';
                ctx.moveTo(dataPoints[i].x, parseFloat(dataPoints[i].y) - 5);
                ctx.lineTo(parseFloat(dataPoints[i].x) - 5, parseFloat(dataPoints[i].y) + 5)
                ctx.lineTo(parseFloat(dataPoints[i].x) + 5, parseFloat(dataPoints[i].y) + 5)
                ctx.lineTo(parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y) - 5)
                ctx.fill();
                ctx.stroke();   
            }    
        }
        // Reset last clicked point
        lastPoint = new Point(0,0,0,0,"a",5);
        
    }  
},
false
); 



//-----------------------------------------------Closest 5------------------------------------------------------------------




window.addEventListener("contextmenu", function(e) {
    
    // Find mouse position
    var mousePos = getMousePos(c, e);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    console.log(mouse);

    var minDist = Infinity;
    var dist = 0;
    var clickRadius = 5;
    var distIndex = {distance:0 , index:0};
    var distIndexVector = [];
    var nearestPoints = [];
    
    // Find distance between selected point and every other point. Also save index for sorting later
    for (i = 0; i < dataPoints.length; i++) {
        // Find distance between current point and mouse pos
        distIndex = {distance:Math.sqrt((mouse.x - dataPoints[i].x) * (mouse.x - dataPoints[i].x) + (mouse.y - dataPoints[i].y) * (mouse.y - dataPoints[i].y)), index:i};

        distIndexVector.push(distIndex);

        if (dist < minDist) {
            minDist = dist;
        }
    }


    // Sort by distance so that the closest points are the first in the vector
    distIndexVector.sort((a,b) => a.distance - b.distance);

    // Create new vector containing selected point and the closest 5
    if(minDist <= dataPoints[distIndexVector[0].index].radius + clickRadius) { 
        for (i = 0; i < 6; i++) {
            nearestPoints.push(dataPoints[distIndexVector[i].index]);
        }  
    }
    
   
    var pColor;

    // Color to highlight selected point
    pColor = 'rgb(20, 241, 108)';

    // Color for the closest points
    highlightColor = 'rgb(16, 146, 133)';
    

    // Check if a point is already selected
    if (lastPoint != nearestPoints[0]) { // New point is clicked
        lastPoint = nearestPoints[0];

        // Draw all points. Needed if user right clicks several points in a row to reset the color of the last selected points
        for (i = 0; i < dataPoints.length; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1.0;
            if (dataPoints[i].type == "a" || dataPoints[i].type == "foo" || dataPoints[i].type == "a\r" || dataPoints[i].type == "foo\r") {
                ctx.fillStyle = 'rgb(255, 107, 171)';
                ctx.arc(dataPoints[i].x, dataPoints[i].y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();   
            }
            else if (dataPoints[i].type == "b" || dataPoints[i].type == "baz" || dataPoints[i].type == "b\r" || dataPoints[i].type == "baz\r") {
                ctx.fillStyle = 'rgb(44, 192, 246)';
                ctx.fillRect(dataPoints[i].x, dataPoints[i].y, 10, 10);
                ctx.fill();
                ctx.strokeRect(dataPoints[i].x, dataPoints[i].y, 10, 10); 
            }
            else if (dataPoints[i].type == "c" || dataPoints[i].type == "bar" || dataPoints[i].type == "c\r" || dataPoints[i].type == "bar\r") {
                ctx.fillStyle = 'rgb(178, 8, 197)';
                ctx.moveTo(dataPoints[i].x, parseFloat(dataPoints[i].y) - 5);
                ctx.lineTo(parseFloat(dataPoints[i].x) - 5, parseFloat(dataPoints[i].y) + 5)
                ctx.lineTo(parseFloat(dataPoints[i].x) + 5, parseFloat(dataPoints[i].y) + 5)
                ctx.lineTo(parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y) - 5)
                ctx.fill();
                ctx.stroke();   
            }    
        }

        // Draw the selected points and the closest 5 with the defined colors
        for (i = 0; i < nearestPoints.length; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1.0;
            if (nearestPoints[i].type == "a" || nearestPoints[i].type == "foo" || nearestPoints[i].type == "a\r" || nearestPoints[i].type == "foo\r") {
                if (i == 0) {
                    ctx.fillStyle = pColor;
                }
                else {
                    ctx.fillStyle = highlightColor;
                }
                ctx.arc(nearestPoints[i].x, nearestPoints[i].y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();   
            }
            else if (nearestPoints[i].type == "b" || nearestPoints[i].type == "baz" || nearestPoints[i].type == "b\r" || nearestPoints[i].type == "baz\r") {
                if (i == 0) {
                    ctx.fillStyle = pColor;
                }
                else {
                    ctx.fillStyle = highlightColor;
                }
                ctx.fillRect(nearestPoints[i].x, nearestPoints[i].y, 10, 10);
                ctx.fill();
                ctx.strokeRect(nearestPoints[i].x, nearestPoints[i].y, 10, 10); 
            }
            else if (nearestPoints[i].type == "c" || nearestPoints[i].type == "bar" || nearestPoints[i].type == "c\r" || nearestPoints[i].type == "bar\r") {
                if (i == 0) {
                    ctx.fillStyle = pColor;
                }
                else {
                    ctx.fillStyle = highlightColor;
                }
                ctx.moveTo(nearestPoints[i].x, parseFloat(nearestPoints[i].y) - 5);
                ctx.lineTo(parseFloat(nearestPoints[i].x) - 5, parseFloat(nearestPoints[i].y) + 5)
                ctx.lineTo(parseFloat(nearestPoints[i].x) + 5, parseFloat(nearestPoints[i].y) + 5)
                ctx.lineTo(parseFloat(nearestPoints[i].x), parseFloat(nearestPoints[i].y) - 5)
                ctx.fill();
                ctx.stroke();   
            }    
        }


    }
    else {// Same point is clicked again
        // Draw points and reset the colors
        for (i = 0; i < dataPoints.length; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1.0;
            if (dataPoints[i].type == "a" || dataPoints[i].type == "foo" || dataPoints[i].type == "a\r" || dataPoints[i].type == "foo\r") {
                ctx.fillStyle = 'rgb(255, 107, 171)';
                ctx.arc(dataPoints[i].x, dataPoints[i].y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();   
            }
            else if (dataPoints[i].type == "b" || dataPoints[i].type == "baz" || dataPoints[i].type == "b\r" || dataPoints[i].type == "baz\r") {
                ctx.fillStyle = 'rgb(44, 192, 246)';
                ctx.fillRect(dataPoints[i].x, dataPoints[i].y, 10, 10);
                ctx.fill();
                ctx.strokeRect(dataPoints[i].x, dataPoints[i].y, 10, 10); 
            }
            else if (dataPoints[i].type == "c" || dataPoints[i].type == "bar" || dataPoints[i].type == "c\r" || dataPoints[i].type == "bar\r") {
                ctx.fillStyle = 'rgb(178, 8, 197)';
                ctx.moveTo(dataPoints[i].x, parseFloat(dataPoints[i].y) - 5);
                ctx.lineTo(parseFloat(dataPoints[i].x) - 5, parseFloat(dataPoints[i].y) + 5)
                ctx.lineTo(parseFloat(dataPoints[i].x) + 5, parseFloat(dataPoints[i].y) + 5)
                ctx.lineTo(parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y) - 5)
                ctx.fill();
                ctx.stroke();   
            }    
        }
        // Reset last clicked point
        lastPoint = new Point(0,0,0,0,"a",5);  
    }
},
false
); 



//---------------------------------------------------- Legend Box -------------------------------------------------

lx.beginPath();
lx.lineWidth = 4.0;
lx.moveTo(0,0);
lx.lineTo(lWidth,0);
lx.lineTo(lWidth,lHeight);
lx.lineTo(0,lHeight);
lx.lineTo(0,0);
lx.stroke();
lx.beginPath();
lx.lineWidth = 2.0;
lx.moveTo(0,20);
lx.lineTo(lWidth, 20)
lx.fillStyle = 'rgb(0, 0, 0)';
lx.font = "15px Arial";
lx.fillText("Legend", 25, 15);
lx.stroke();

