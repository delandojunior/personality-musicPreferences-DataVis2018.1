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

var distsP = [];
var musicAVG = {};
var data = [];
var users = [10208546854389224, 1563678377056306, 1530736360375283, 2054932291405079, 1618190434907835, 1699351673460266, 1514091155313332, 1618039888276205, 1553537528027304, 1637518839632801, 10215430654344419, 1522314377864628, 10209650048201294, 2017981634883481, 10215796188923215, 2010647765618965, 1753478071331041, 772600926262323, 1504078906355689, 10203948114340915, 1827922500615547, 1706666589387705, 1609898125756255, 2455041724720870, 1626551127391406, 1244898128943328, 1274496899362093, 1575540589166609, 1569347423101232, 10208732194622753, 1723951330982372] ;
var selectedUser = users[Math.floor(Math.random()*users.length)];


function updateStar(id, d, options) {
  d3.select("#star").remove();
  RadarChart.draw(id,d,options);

  // body... 
}

function updateData (musicMean) {
  if(musicMean.length<1){return;}
  musicMean = selectedLines.reduce(function(acumulador, valorAtual){

    acumulador["Acousticness"] = (Number(acumulador["Acousticness"]) + Number(valorAtual["Acousticness"]));
    acumulador["Danceability"] = (Number(acumulador["Danceability"]) + Number(valorAtual["Danceability"]));
    acumulador["Energy"] = (Number(acumulador["Energy"]) + Number(valorAtual["Energy"]));
    acumulador["Liveness"] = (Number(acumulador["Liveness"]) + Number(valorAtual["Liveness"]));
    acumulador["Popularity"] = (Number(acumulador["Popularity"]) + Number(valorAtual["Popularity"]));
    acumulador["Valence"] = (Number(acumulador["Valence"]) + Number(valorAtual["Valence"]));
    acumulador["instrumentalness"] = (Number(acumulador["instrumentalness"]) + Number(valorAtual["instrumentalness"]));
    acumulador["tempo"] = (Number(acumulador["tempo"]) + Number(valorAtual["tempo"]));
    return acumulador;
  });
  //calculando médias
  musicMean["Acousticness"] = musicMean["Acousticness"]/selectedLines.length;
  musicMean["Danceability"] = musicMean["Danceability"]/selectedLines.length;
  musicMean["Energy"] = musicMean["Energy"]/selectedLines.length;
  musicMean["Liveness"] = musicMean["Liveness"]/selectedLines.length;
  musicMean["Popularity"] = musicMean["Popularity"]/selectedLines.length;
  musicMean["Valence"] = musicMean["Valence"]/selectedLines.length;
  musicMean["instrumentalness"] = musicMean["instrumentalness"]/selectedLines.length;
  musicMean["tempo"] = musicMean["tempo"]/selectedLines.length;
 

  data[0][0].value = 100*(-0.3105 - 0.9672*musicMean["Energy"] + 0.00994*musicMean["tempo"]);
  data[0][1].value = 100*(-1.53 + 0.01348*musicMean["tempo"] + 0.64522*musicMean["Valence"]);
  data[0][2].value = 100*(-0.360531 - 0.551762*musicMean["instrumentalness"] + 0.007315*musicMean["tempo"] -0.602617*musicMean["Liveness"]);
  data[0][3].value = 100*(1.2671 - 0.7962*musicMean["Danceability"] - 0.6380*musicMean["Energy"]);
  data[0][4].value = 100*(-0.07196 + 0.95528*musicMean["Danceability"]);

  updateStar("#chart", data, config);
  return musicMean;



}
    

				

d3.csv('/data/dados1.csv' , function(error, rows) {
   
   rows.forEach( function(element, index) {
    
    console.log(element["Id"]);
     if(element["Id"] == selectedUser.toString()){
      user = element;
     };
   });
   

   rows.forEach( function(element, index) {
    distsP.push([Number(element["Neuroticism"]),Number(element["Conscientiousness"]),Number(element["Extraversion"]),Number(element["Openness"]),Number(element["Agreeableness"])]);
    if(index<5){
      
     }// statements
   });
   
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


});