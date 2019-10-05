// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
function makeResponsive() {

    var svgWidth = 960;
    var svgHeight = 500;

    // Define the chart's margins as an object
    var margin = {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set its dimensions
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Append a group area, then set its margins
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //var filen = "/assets/data/data.csv"
    var filen = "data.csv"

    // Load data from miles-walked-this-month.csv

    d3.csv(filen, function(error, cdata) {

      // Throw an error if one occurs
      if (error) return console.warn(error);

      //SELECT DATA TO PRESENT IN GRAPH
      // var xdata = cdata.map(p => parseFloat(p.obesity));
      // var xlabel = "% Obesity";
      // var ydata = cdata.map(x => parseFloat(x.income));
      // var ylabel = "Income Level";

      //SELECT DATA TO PRESENT IN GRAPH - ALTERNATIVE 2
      // var xdata = cdata.map(p => parseFloat(p.poverty));
      // var xlabel = "% Poverty";
      // var ydata = cdata.map(x => parseFloat(x.obesity));
      // var ylabel = "% of Obesity";

        //SELECT DATA TO PRESENT IN GRAPH - ALTERNATIVE 3
        var xdata = cdata.map(p => parseFloat(p.poverty));
        var xlabel = "% Poverty";
        var ydata = cdata.map(x => parseFloat(x.smokes));
        var ylabel = "% Smoking";

      var states = cdata.map(s => s.abbr);

      console.log("Max ",ylabel," ", d3.max(ydata));
      console.log("Max ",xlabel," ", d3.max(xdata));

      // Configure a linear scale with a range between the chartHeight and 0
      // Set the domain for the xLinearScale function
      var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([d3.min(ydata), d3.max(ydata)]);


      var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([d3.min(xdata), d3.max(xdata)]);


      // Create two new functions passing the scales in as arguments
      // These will be used to create the chart's axes
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);


      // Append an SVG group element to the SVG area, create the left axis inside of it
      chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

      // Append an SVG group element to the SVG area, create the bottom axis inside of it
      // Translate the bottom axis to the bottom of the page
      chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(bottomAxis);

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (chartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(ylabel);

        chartGroup.append("text")
        .attr("y", chartHeight+ 20)
        .attr("x", chartWidth / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(xlabel);

        //  for (var i = 0; i < xdata.length; i++) {
        //   chartGroup.append("circle")
        //     .attr("cx", xLinearScale(xdata[i]))
        //     .attr("cy", yLinearScale(ydata[i]))
        //     .attr("r", 10)
        //     .attr("stroke-width", "5")
        //     .attr("fill", "lightblue");

          //  chartGroup.append("text")
          //    .attr("x", xLinearScale(xdata[i])-6)
          //    .attr("y", yLinearScale(ydata[i])+2)
          //    .attr("font-size", "10px")
          //    .text(states[i])
          //  }

        var circlesGroup = chartGroup.selectAll("circle")
        .data(cdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

        var textGroup = chartGroup.selectAll("text")
        .data(cdata)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty)-6)
        .attr("y", d => yLinearScale(d.smokes)+5)
        .attr("font-size", "10px")
        .text(d => d.abbr)
  
            //  var circlesGroup = chartGroup.selectAll("circle")

      // Step 1: Initialize Tooltip

          var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`${d.state}<hr> %smoking: ${d.smokes} <hr> %poverty: ${d.poverty} `);
          });

      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
    });

  }

  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  // d3.select(window).on("resize", makeResponsive);
