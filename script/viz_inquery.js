// PACK

var diameter = 600, //max size of the bubbles
    color    = d3.scale.category20b(); //color category

var bubble = d3.layout.pack()
    // .sort(function(a, b){return a.content.count - b.content.count;})
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600)
    .attr("class", "bubble");

  //Set up tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
    return  d.term;
})
svg.call(tip);

// TREE

var margin = {top: 20, right: 120, bottom: 20, left: 120},
 width = 960 - margin.right - margin.left,
 height = 500 - margin.top - margin.bottom;

var svg_tree = d3.select("body").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0;

var tree = d3.layout.tree()
 .size([height, width]);

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });


d3.json('data/terms_inquery_db_final_dic.json', function(dataset) {

  //PACK

  data = dataset.map(function(d){ d.value = +d.content.count; return d; });

  var nodes_pack = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

  var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes_pack)
        .enter();

  bubbles.append("circle")
         .attr("r", function(d){ return d.r; })
         .attr("cx", function(d){ return d.x; })
         .attr("cy", function(d){ return d.y; })
         .style("fill", "lightblue")
         .on('mouseover', function(d) {
           tip.show(d);
           d3.select(this)
             .transition()
             .duration(100)
             // .style("fill", "blue");
             .style("fill", "orange");})
         .on('mouseout', function(d) {
           tip.hide(d);
           d3.select(this)
             .transition()
             .duration(100)
             // .style("fill", "lightsteelblue");
             .style("fill", "lightblue");});
});
  // TREE

d3.json('data/terms_inquery_prueba.json', function(dataset) {
  root = dataset[0];
  console.log(dataset[0])

  update(root);

  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
     links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Declare the nodesâ€¦
    var node = svg_tree.selectAll("g.node")
     .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
     .attr("class", "node")
     .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")"; });

    nodeEnter.append("circle")
     .attr("r", 6)
     .style("fill", "#fff");

    nodeEnter.append("text")
     .attr("x", function(d) {
      return d.children || d._children ? -13 : 13; })
     .attr("dy", ".35em")
     .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start"; })
     .text(function(d) { return d.query + ":" + d.count; })
     .style("fill-opacity", 1);
     // .style("font-size", d.count);

    // Declare the linksâ€¦
    var link = svg_tree.selectAll("path.link")
     .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
     .attr("class", "link")
     .attr("d", diagonal);

  }


  });
