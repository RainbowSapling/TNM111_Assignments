
// Canvas settings
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.style.background = "#ddf";

class Point {
    constructor(x, y, type) {
        this.x = x;
        this.y = y,
        this.type = type;
    }
}


var dataPoints = [];


// Read a csv file
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            var splitLines = content.trim().split("\n");
            
            for (i = 0; i < splitLines.length; i++) {
                let temp = splitLines[i].split(",");
                let point = new Point(temp[0], temp[1], temp[2]);
                dataPoints.push(point);
            };
        };
        reader.readAsText(file);
    }
});

console.log(dataPoints);
