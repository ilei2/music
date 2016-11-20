//(function() {
$(document).ready(function () {
    'use strict';

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('audioElement');
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    // bind our analyser to the media element source.
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    // var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var frequencyData = new Uint8Array(200);

    var svgHeight = 600,
        svgWidth = 960;

    var svg = d3.select('body').append('svg')
        .attr({
            height: svgHeight,
            width: svgWidth
        });

    // continuously loop and update chart with frequency data.
    function renderChart() {
        requestAnimationFrame(renderChart);

        // copy frequency data to frequencyData array.
        analyser.getByteFrequencyData(frequencyData);
        // console.log(frequencyData);


        var length = d3.scale.linear()
                  .domain([0, d3.max(frequencyData)])
                  .range([0, svgHeight/3+10]);
        var hueScale = d3.scale.linear()
                  .domain([0, d3.max(frequencyData)])
                  .range([0, 265]); //360
        var squares = svg.selectAll('rect')
                  .data(frequencyData);
        squares.enter().append('rect');
        squares
            .attr({
              //perfect squares
              x: function(d) {return 500-length(d);},
              y: function(d) {return 300-length(d);},
              width: function(d) {return length(d)*2;},
              height: function(d) {return length(d)*2;},
              fill: 'none',
              'stroke-width': 2,
              'stroke-opacity': 0.5,
              stroke: function(d) { return d3.hsl(hueScale(d), 1, .5);}
            });

        // scale things to fit
        squares.exit().remove();
        //circles.exit().remove();
    }

    // run the loop
    renderChart();
    // just for blocks viewer size
    d3.select(self.frameElement).style('height', '700px');

}());
