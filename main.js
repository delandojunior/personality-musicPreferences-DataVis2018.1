var dados = d3.csv("dados.csv", function(error, users){
	if (error) throw error;
	console.log('dados lidos');
	debugger;
})