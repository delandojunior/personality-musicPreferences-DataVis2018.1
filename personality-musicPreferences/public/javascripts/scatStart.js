class Scatterplot{
    constructor(container,widgetID,screenX,screenY,totalWidth,totalHeight) {
	//
	this.renderingArea = {x:screenX,y:screenY,
			      width:totalWidth,height:totalHeight};
	this.margins = {left:9,right:5,top:5,bottom:-12};
	this.canvasWidth = this.renderingArea.width - this.margins.left - this.margins.right;
	this.canvasHeight = this.renderingArea.height - this.margins.top - this.margins.bottom;
	this.widgetID = widgetID;

	//
	this.data = [];	

		
	//
	this.canvas = container
	    .append("g")
	    .attr("id","plot_" + widgetID)
	    .attr("transform","translate("+
		  (this.renderingArea.x+this.margins.left) + ", " + (this.renderingArea.y+this.margins.top) + ")");
	
	//

	this.colorScale = d3.scaleOrdinal().domain([0,1,2,3,4]).range(['#d7191c','#fdae61','#1a9641','#abd9e9','#2c7bb6']);
	

	this.xScale = d3.scaleLinear()
	    .range([this.margins.left,this.canvasWidth+20]);
	this.xAxis  = d3.axisBottom(this.xScale);
	
	this.canvas
	    .append("g")
	    .attr("class","xAxis")
	    .attr("transform","translate(0," + this.canvasHeight  + ")");

	//
	this.yScale = d3.scaleLinear()
	    .range([this.canvasHeight-10,0]);
	this.yAxis  = d3.axisLeft(this.yScale);
	this.canvas
	    .append("g")
	    .attr("class","yAxis");

		//
	var plot = this;
	var brushGroup = this.canvas.append("g").attr("class","brush");
	this.brush = d3.brush()
	    .on("start",function(){

		plot.canvas.selectAll("circle").attr("fill",function(d,i){return plot.colorScale(d[2])});
		
	    })
	    .on("brush",function(){
		var selectedPoints = [];
		var selection = d3.event.selection;


		plot.canvas.selectAll("circle")
		    .attr("fill",function(d,i){
			var x = plot.xScale(d[0]);
			var y = plot.yScale(d[1]);
			var c = plot.colorScale(d[2]);
			
			//console.log(c);
			if(selection && selection[0][0]<=x && x<=selection[1][0] &&
			   selection[0][1] <= y && y <= selection[1][1]){
			    selectedPoints.push(i);

			    return "black";
			}
			
			return c;
		});
		//
			if(plot.selectionCallback){

				plot.selectionCallback(selectedPoints);

			}
	    })
	  //   .on("end", function() {
		 //    if(plot.selectionCallback){
			// 	var newData = []
			// 	var selectedPoints = [];
			// 	var selection = d3.event.selection;
				
			// 	plot.canvas.selectAll("circle")
			// 	    .attr("fill",function(d,i){
			// 		var x = plot.xScale(d[0]);
			// 		var y = plot.yScale(d[1]);
					
			// 		if(selection && selection[0][0]<=x && x<=selection[1][0] &&
			// 		   selection[0][1] <= y && y <= selection[1][1] ){
					    
			// 			selectedPoints.push(i);
			// 		    return "orange";
			// 		}
			// 		else
			// 		    return "black";
			// 	});
			// 	plot.selectionCallback(selectedPoints);
			// }
		    	
	  //   });
	brushGroup.call(this.brush);

	
	//	
	this.updatePlot();
    }
    
    setSelectionCallback(f){
		this.selectionCallback = f;
    }

    setSelected(arrayIndex){
    	var colorScale = d3.scaleOrdinal().domain([0,1,2,3,4]).range(['#d7191c','#fdae61','#1a9641','#abd9e9','#2c7bb6']);
    	
    	
    	this.canvas.selectAll("circle").attr("fill",function(d,i){

    		if(arrayIndex.indexOf(i) != -1){
    			return "black";
    		}
    		else{
    			return colorScale(d[2]);
    		}
    	})

    }

    setData(newData, trips) {

		this.data = newData;
		this.trips = trips;


		
		//
		this.xScale.domain(d3.extent(newData,d=>d[0]));
		this.yScale.domain(d3.extent(newData,d=>d[1]));
		//

		// console.log('data ' + this.data.length);
		this.updatePlot();
    }


    updateAxis() {
	var canvasWidth = this.canvasWidth;
	var canvasHeight = this.canvasHeight ;
	

	//text label for the x axis
	this.xAxis(this.canvas.select(".xAxis"));

	//text label for the y axis
	this.yAxis(this.canvas.select(".yAxis"));
    }
    
    updateDots() {
    //console.log('Setando nova data');

	var circles = this.canvas.selectAll("circle").data(this.data);
	circles.exit().style('visibility', 'hidden');
	var plot = this;
	circles
	    .enter()
	    .append("circle")
	    .merge(circles)
	    .attr("cx",d=>plot.xScale(d[0]))
	    .attr("cy",d=>plot.yScale(d[1]))
	    .attr("r",3)
	    .attr("fill",d=>plot.colorScale(d[2]))
	    .attr('id', function(d,i){return i})
	    .style('visibility', 'visible');
    }
    
    updatePlot(){
	this.updateAxis();
	this.updateDots();
    }       
}