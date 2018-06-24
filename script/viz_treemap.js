var w = 1280 - 80,
    h = 800 - 180,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([0, h]),
    color = d3.scale.category20(),
    root,
    node;

var treemap = d3.layout.treemap()
    .round(false)
    .size([w, h])
    .sticky(true)
    .value(function(d) { return d.size; });

var svg = d3.select("#body").append("div")
    .attr("class", "chart")
    .style("width", w + "px")
    .style("height", h + "px")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(.5,.5)");

    var tip_meaning = d3.tip({})
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
        return  d.meaning + "";
    })
    svg.call(tip_meaning);



d3.json("data/terms_meaning_hierarchy_sin-.json", function(data) {
  node = root = data;

  var nodes = treemap.nodes(root)
      .filter(function(d) { return !d.children; });

  var cell = svg.selectAll("g")
      .data(nodes)
    .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

  cell.append("svg:rect")
      .attr("width", function(d) { return d.dx - 1; })
      .attr("height", function(d) { return d.dy - 1; })
      .style("fill", function(d) { return color(d.parent.name); })
      .on('mouseover', function(d) {
        tip_meaning.show(d);
        d3.select("h1").text(d.parent.name);
          }) //Added
      // .on('mouseover', tip_meaning.show)
      .on('mouseout', tip_meaning.hide);

  cell.append("svg:text")
      .attr("x", function(d) { return d.dx / 2; })
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
      // .style("opacity", function(d) { return d.dx > d.w ? 1 : 0; })
      // .style("font-size", function(d){ return d.dx/4; })
      .style("font-size", function(d) { return Math.min(d.dx, d.dy)/4 + "px"; })
      .style({
             "fill":"white",
             "font-family":"Source Sans Pro, Helvetica, Arial, san-serif"});

  d3.select(window).on("click", function() { zoom(root); });

});

function zoom(d) {
  var kx = w / d.dx, ky = h / d.dy;
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, d.y + d.dy]);

  var t = svg.selectAll("g.cell").transition()
      .duration(d3.event.altKey ? 7500 : 2000)
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  t.select("rect")
      .attr("width", function(d) { return kx * d.dx - 0.5; })
      .attr("height", function(d) { return ky * d.dy - 0.5; })

  t.select("text")
      .attr("x", function(d) { return kx * d.dx / 2; })
      .attr("y", function(d) { return ky * d.dy / 2; })
      // .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; })
      // .style("font-size", function(d){ return kx*d.dx/4; });
      .style("font-size", function(d) { return Math.min(kx*d.dx, ky*d.dy)/4 + "px"; });

  node = d;
  d3.event.stopPropagation();
}
