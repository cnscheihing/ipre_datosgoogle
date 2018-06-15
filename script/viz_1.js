var WIDTH = 40000;
var HEIGHT = 1000;

d3.json('data/terms_meaning_db_final.json', function(dataset) {


  // Probar si carga bien: imprimiendo en consola
  // for (var i = 0; i < dataset.length; i++) {
  //   console.log(dataset[i]);
  console.log(dataset.length);

  var max_count = Math.max.apply(Math, dataset.map(function(o) {return o.count;}))
  var scale = d3.scale.log()
                .domain([1, max_count])
                .range([20, 0]);

  var canvas = d3.select('body')
                 .append('svg')
                 .attr('width', WIDTH)
                 .attr('height', HEIGHT);

  canvas.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        // .attr('r', function(d) {return d.count;})
        // .attr('r', function(d) {return scale(d.count);})
        .attr('r', function(d) {return Math.sqrt(d.count/3.1415)*10;})
        .attr('cy', 300)
        .attr('cx', function(d, i) {return i*15 + 50;})
        .attr('fill', 'rgba(0, 0, 255, 0.75)')
        .attr('class', 'term');
        //.text(function(d) {return d.term;});


  });
