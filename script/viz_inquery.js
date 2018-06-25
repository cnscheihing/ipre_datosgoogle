
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
                .attr('id', 'tree_yupi')
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

  //TREE
  function update_tree(source, svg_tree) {
      root = source
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
       .text(function(d) { return d.query + ": " + d.count; })
       .style("font-size", function(d) {d.count + "px";})
       .style("fill-opacity", 1);

      // Declare the linksâ€¦
      var link = svg_tree.selectAll("path.link")
       .data(links, function(d) { return d.target.id; });

      // Enter the links.
      link.enter().insert("path", "g")
       .attr("class", "link")
       .attr("d", diagonal);

  }

  function reset_svg_tree(){

      var elem = document.getElementById("tree_yupi");
      elem.parentNode.removeChild(elem);
      var svg_tree = d3.select("body").append("svg")
                      .attr('id', 'tree_yupi')
                      .attr("width", width + margin.right + margin.left)
                      .attr("height", height + margin.top + margin.bottom)
                       .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      return svg_tree

  }

  var term = {'query': dataset[0].term, 'count': dataset[0].content.count, 'children': dataset[0].content.children}
  update_tree(term, svg_tree)


  // PACK
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
             .style("fill", "lightblue");})
          .on("click", function(d){
            var term = {'query': d.term, 'count': d.content.count, 'children': d.content.children};
            console.log(term);
            lala = reset_svg_tree();
            update_tree(term, lala);
          });
});

function reset_svg_tree(){

    var elem = document.getElementById("tree_yupi");
    elem.parentNode.removeChild(elem);
    var svg_tree = d3.select("body").append("svg")
                    .attr('id', 'tree_yupi')
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                     .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return svg_tree

}

function handleClick(event){
               // console.log(document.getElementById("myVal").value)
               update_tree_searchbar(document.getElementById("myVal").value)
               return false;
           }

function update_tree_searchbar(val){

   d3.json('data/terms_inquery_db_final_dic.json', function(dataset) {
     result = dataset.filter(function(d) { return d.term === val; });
     console.log(result[0]);
     function update_tree(source, svg_tree) {
         root = source
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
          .text(function(d) { return d.query + ": " + d.count; })
          .style("font-size", function(d) {d.count + "px";})
          .style("fill-opacity", 1);

         // Declare the linksâ€¦
         var link = svg_tree.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

         // Enter the links.
         link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", diagonal);

     }
     if (result) {
       var term = {'query': result[0].term, 'count': result[0].content.count, 'children': result[0].content.children};
       // console.log(term);
       lala = reset_svg_tree();
       update_tree(term, lala);
     }
   })
}
