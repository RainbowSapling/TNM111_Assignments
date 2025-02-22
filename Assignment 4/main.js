import { select } from 'https://esm.sh/d3-selection';
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceCollide } from 'https://esm.sh/d3-force';

// Good links:
// https://www.d3indepth.com/force-layout/
// https://d3-graph-gallery.com/network.html


// Create variable to store the json file
var file;

// Read the selected json file and store it in "file"
(function(){    
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event){
        file = JSON.parse(event.target.result);
    }
    
    document.getElementById('fileInput').addEventListener('change', onChange);

}());


// Might need, who knows...
let btn = document.querySelector("#selectFile")
btn.addEventListener("click", function() {
    
    // Split the file into nodes and links
    var nodes = file.nodes;
    var links = file.links;

    console.log(nodes);
    console.log(links);
    

    // Define the size of the svg area
    let width = 1400, height = 950

    // Variable for radius of points
    var radius = 10;


    // Create force simulations
    let simulation = forceSimulation(nodes) 
        .force('charge', forceManyBody().strength(-50)) // Force that makes objects repel each other
        .force('center', forceCenter(width / 2, height / 2)) // Force that attracts objects to the center
        .force('collision', forceCollide().radius(radius)) // Force that gives points a hitbox so they donnt overlap
        .force('link', forceLink().links(links).distance(15).strength(0.05)) // Force that makes linked nodes be a set distance from each other
        .on('tick', ticked); // Calls function "ticked" every iteration


    // Function to draw points on the svg
    function updateNodes() {
        select('svg')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', radius) // Sets radius
            .style("fill", function (d) { // Set color of point to the color specified in the file
                return d.colour
            })
            .attr('cx', function(d) { // Sets x position
                return d.x = Math.max(radius, Math.min(width - radius, d.x)); // Prevents point going off screen
            })
            .attr('cy', function(d) { // Sets y position
                return d.y = Math.max(radius, Math.min(height - radius, d.y)); // Prevents point going off screen
            });
    }
    
    // Function to draw links between the points
    function updateLinks() {
        select('svg')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', 'black') // Color of line
            .attr('opacity', 0.3) // Opacity of line
            .attr('stroke-width', 1.5) // Set line width
            .attr('x1', function(d) { // X position of source point
                return d.source.x
            })
            .attr('y1', function(d) { // Y position of source point
                return d.source.y
            })
            .attr('x2', function(d) { // X position of target point
                return d.target.x
            })
            .attr('y2', function(d) { // Y position of target point
                return d.target.y
            });
    }
    
    // Joins node array to circle elements and updates their position
    function ticked() {
        updateLinks()
        updateNodes()
    }
});


