/*
This is a simple histogram script
The data comes from an R Shiny application
Input data is a list with two elements:
data - actual data values, generated from a beta distribution
n_bins - the (approximate) number of bins in the histogram, selected by the user
*/

// binding to get data from shiny & r
var outputBinding = new Shiny.OutputBinding();
$.extend(outputBinding, {
  find: function(scope) {
    return $(scope).find('.d3graph'); // find the linked elements
  },
  renderValue: function(el, data) {  
    wrapper(el, data); // render the results of this function
  }});
Shiny.outputBindings.register(outputBinding); // register the binding

function wrapper(el, data) {  // this is the function that will run in the client
  
  // create the svg to house the plot
  d3.select(el).select("svg").remove();
  var svg = d3.select(el)
    .append("svg")
    .attr("width", 700)
    .attr("height", 300);
  
  // variables for later
  var width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 20, right: 30, bottom: 30, left: 40},
    bin, g, group;
  
  // x axis scale, this data only goes from 0 to 1
  var x = d3.scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right]);
  
  // add x axis
  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("x", width - margin.right)
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "end")
      .attr("font-weight", "bold")
      .text("Randomly generated data.");
  
  // when the data comes in, plot it.
  if(data) {
    
    // pull out the actual data from r
    var dat = data.data;
    
    var n = dat.length, // number of points
        bin_count = []; // storage for bin count
    
    // make bins manually
    var tempScale = d3.scaleLinear().domain([0, data.n_bins]).range([0, 1]);
    var manual_bins = d3.range(data.n_bins + 1).map(tempScale);
    
    
    // make binned data
    var bins = d3.histogram()
      .domain(x.domain())
      .thresholds(manual_bins)
      (dat); // bin based on the number of bins in r
      
    // get a count of each bin for creation of y axis
    bins.forEach(function(x) { bin_count.push(x.length); });
    
    // y axis scale
    var y = d3.scaleLinear()
      .domain([0, d3.max(bin_count) + 5])
      .range([height - margin.bottom, margin.top]);
  
    // add y axis  
    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));
    
    // bar holder
    g = svg.insert("g", "*")
        .attr("fill", "#bbb");
    
    // container for each bar
    // link to the binned data
    bin = g.selectAll("g.bin")
      .data(bins);
      
    // enter new bins  
    group = bin.enter().insert("g")
        .attr("class", "bin");
    
    // add a rectangle to represent each bin    
    group.append("rect")
          .attr("x", function(d) { return x(d.x0) + 1; })
          .attr("y", function(d) { return y(d.length); })
          .attr("width", function(d) { return d3.max([0, x(d.x1) - x(d.x0) - 1]); })
          .attr("height", function(d) { return y(0) - y(d.length); });
    
    // add text that appears on hover    
    group.append("text")
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .attr("x", function(d) { return x(d.x0) + (x(d.x1) - x(d.x0))/2; })
          .attr("y", function(d) { return y(d.length) - 5; })
          .text(function(d) { return d.length; });
        
    // Exit any old bins.
    bin.exit().remove();
        
  }
}
