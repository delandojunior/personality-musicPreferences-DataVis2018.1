var margin = {top: 30, right: 10, bottom: 10, left: 20},
    width_parallel = 960 - margin.left - margin.right,
    height_parallel = 500 - margin.top - margin.bottom;

var x = d3.scaleOrdinal().range([0, width_parallel]),
    y = {},
    dragging = {};

var line = d3.line(),
    background,
    foreground;

var svg = d3.select("body").append("svg")
    .attr("width", width_parallel + margin.left + margin.right)
    .attr("height", height_parallel + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/data/dados.csv", function(error, cars) {

  offColumns = ["Id","Gender","Likes_used","tempo", "Popularity"]
  //domain
  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    
    return !offColumns.includes(d) && (y[d] = d3.scaleLinear()
        .domain([0.00,1.00])
        //.domain(d3.extent(cars, function(p) { return + p[d]; }))
        .range([height_parallel, 0]));

  })); 

  rangeX = [];
  var posX = margin.left , dist = width_parallel/dimensions.length;

  for (var i = dimensions.length - 1; i >= 0; i--) {
    rangeX.push(posX);
    posX  += dist;

  }
  x.range(rangeX);


  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.drag()
        .subject(function(d) { return {x: x(d)}; })
        .on("start", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(width_parallel, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("end", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(d3.axisLeft(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.brushY(y[d]).on("start", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
});

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  // var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
  var actives = dimensions.filter(function(p) { return d3.event.selection === null; }),
      extents = actives.map(function(p) { return brush.extent(y[p]); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}
