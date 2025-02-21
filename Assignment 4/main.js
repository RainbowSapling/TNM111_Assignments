import { select } from 'https://esm.sh/d3-selection';
import { forceSimulation, forceManyBody, forceCenter } from 'https://esm.sh/d3-force';

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

    console.log(file);   



    let width = 300, height = 300
    let nodes = [{}, {}, {}, {}, {}]

    let simulation = forceSimulation(nodes)
        .force('charge', forceManyBody().strength(-20))
        .force('center', forceCenter(width / 2, height / 2))
        .on('tick', ticked);

    function ticked() {
        select('svg')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 5)
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            });
    }
});


