var width = 200,
    height = 200;

// Config for the Radar chart
var config = {
    w: width,
    h: height,
    maxValue: 100,
    levels: 5,
    ExtraWidthX: 300
}

				

d3.csv('/data/dados.csv' , function(error, rows) {
   user = rows[0];
   data = [
    [
      {"area": "Neuroticism ", "value": user.Neuroticism*100},
      {"area": "Conscientiousness", "value": user.Conscientiousness*100},
      {"area": "Extraversion ", "value": user.Extraversion*100},
      {"area": "Openness ", "value": user.Openness*100},
      {"area": "Agreeableness ", "value": user.Agreeableness*100},
  	]
  ]

   RadarChart.draw("#chart", data, config);

var svg = d3.select('body')
	.select('#chart')
	.append('svg')
	.attr("width", width)
	.attr("height", height);
	
});
