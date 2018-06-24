// var WIDTH = 40000;
// var HEIGHT = 1000;

var diameter = 1500, //max size of the bubbles
    color    = d3.scale.category20b(); //color category

var bubble = d3.layout.pack()
    // .sort(function(a, b){return a.morphology[0].length - b.morphology[0].length;})
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  //Set up tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
    return  d.meaning + "";
})
svg.call(tip);

d3.json('data/terms_meaning_db_final.json', function(data) {

  data = data.map(function(d){ d.value = +d.count; return d; });

  var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

  var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

  bubbles.append("circle")
         .attr("r", function(d){ return d.r; })
         .attr("cx", function(d){ return d.x; })
         .attr("cy", function(d){ return d.y; })
         .style("fill", function(d) { return color(d.morphology[0]); })
         // .style("fill", function(d) { return color(d.r); })
         .on('mouseover', tip.show) //Added
         .on('mouseout', tip.hide);

  bubbles.append("text")
         .attr("x", function(d){ return d.x; })
         .attr("y", function(d){ return d.y; })
         .attr("text-anchor", "middle")
         .text(function(d){ return d.term; })
         .style({
             "fill":"white",
             "font-family":"Source Sans Pro, Helvetica, Arial, san-serif"})
             // "font-size": "3px"});
         .style("font-size", function(d){return (d.r)/2});

  });
