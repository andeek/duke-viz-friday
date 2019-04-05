var outputBinding = new Shiny.OutputBinding();
$.extend(outputBinding, {
  find: function(scope) {
    return $(scope).find('.d3graph');
  },
  renderValue: function(el, data) {  
    wrapper(el, data);
  }});
Shiny.outputBindings.register(outputBinding);

function wrapper(el, data) {  
  
  d3.select(el).select("svg").remove();
  var svg = d3.select(el)
    .append("svg")
    .attr("width", 700)
    .attr("height", 300);
  
  var width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 20, right: 30, bottom: 30, left: 40},
    bin, g, group;
  
  var x = d3.scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right]);

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
      
  var y = d3.scaleLinear()
      .domain([0, 130])
      .range([height - margin.bottom, margin.top]);

  svg.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));
  
  
  if(data) {
    
    var dat = data.data;
    
    var n = dat.length,
        bins = d3.histogram().domain(x.domain()).thresholds(data.n_bins)(dat);

    g = svg.insert("g", "*")
        .attr("fill", "#bbb");
        
    bin = g.selectAll("g.bin")
      .data(bins);
      
    // enter new bins  
    group = bin.enter().insert("g")
        .attr("class", "bin");
        
    group.append("rect")
          .attr("x", function(d) { return x(d.x0) + 1; })
          .attr("y", function(d) { return y(d.length); })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
          .attr("height", function(d) { return y(0) - y(d.length); });
        
    group.append("text")
          .attr("fill", "black")
          .attr("x", function(d) { return x(d.x0) + 1; })
          .attr("y", function(d) { return y(d.length) + 10; })
          .text(function(d) { return d.length; });
        
    // Exit any old bins.
    bin.exit().remove();
        
  }
}
