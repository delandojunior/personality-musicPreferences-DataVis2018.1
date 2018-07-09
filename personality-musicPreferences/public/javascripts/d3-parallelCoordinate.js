var margin = {top: 30, right: 10, bottom: 10, left: 20},
    width_parallel = 960 - margin.left - margin.right,
    height_parallel = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width_parallel], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;


var svg = d3.select("#parallel").append("svg")
    .attr("width", width_parallel + margin.left + margin.right)
    .attr("height", height_parallel + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var selectedLines = [];


//var acumulador = {};



d3.csv("/data/musicasUser.csv", function(error, cars) {

  offColumns = ["Id","Gender","Likes_used","nome","banda","userId", "idMusica"]
  var scaleFeatures = {
    "Popularity" : [0,100],
    "tempo" : [80.0,200.0]
  }

  // Extract the list of dimensions and create a scale for each.
   // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {

    if (!offColumns.includes(d)){
      try {
        return (y[d] = d3.scale.linear()
          .domain(scaleFeatures[d])
          .range([height_parallel, 0]));
      } catch(e) {
        console.log(e);
        return (y[d] = d3.scale.linear()
          .domain([0.0,1.0])
          .range([height_parallel, 0]));
        
      }
    }
  }));

  cars = cars.filter(function(d){
    if(d["userId"] == 10208546854389224){
      return d;
    }
     
  });


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
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
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
        .on("dragend", function(d) {
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
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush).on("brushend",brushend));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
  }
);



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

function brushend(){
  selectedLines = [];
  lines = d3.selectAll(".foreground > *");

  lines[0].forEach( function(element, index) {
  
    if (element.style.display == "") {
      selectedLines.push(element.__data__);
    }   
  });

  // var acumulador = {
  //   "Acousticness": 0,
  //   "Danceability": 0,
  //   "Energy": 0,
  //   "Liveness": 0,
  //   "Popularity": 0,
  //   "Valence": 0,
  //   "instrumentalness": 0,
  //   "tempo": 0
  // }

  
  musicAVG = updateData(selectedLines);
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {

    return actives.every(function(p, i) {
      if(extents[i][0] <= d[p] && d[p] <= extents[i][1]){
        return (extents[i][0] <= d[p] && d[p] <= extents[i][1]);
      }
      //return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}