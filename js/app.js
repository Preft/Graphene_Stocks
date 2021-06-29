function getComboA(selectObject) {
  var value = selectObject.value;
  GraphSetUp(value);
}
GraphSetUp = (stockTicker) => {
  //Declar Vars & Chart Size
  var svgWidth = 700;
  var svgHeight = 500;
  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 200
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Select Chart 
  d3.select("#scatter").selectAll('*').remove();
  var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);
  var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Default Graph Selection
  var chosenYAxis = "close";

  // Define functions for chart
  yScale = (data, chosenYAxis) => {
    var yLinearScale = d3.scaleLinear().domain([d3.min(data, d => d[chosenYAxis] * .97), d3.max(data, d => +d[chosenYAxis]) * 1.1]).range([height, 0]);
    return yLinearScale;
  }

  generateHorizontalAxes = (newYScale, yAxis) => {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition().duration(1000).call(leftAxis);
    return yAxis;
  }

  generatePoints = (circlesGroup, newYScale, chosenYAxis) => {
    circlesGroup.transition().duration(1000).attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

  generateTextPoints = (textsGroup, newYScale, chosenYAxis) => {
    textsGroup.transition().duration(1000).attr("y", d => newYScale(d[chosenYAxis] - .2));
    return textsGroup;
  }

  var dateFormatter = d3.timeFormat("%d-%b");  
  // Tool Chart
  updateToolTip = (chosenYAxis, circles) => {
    var ylabel;

    if (chosenYAxis === "close") {
      ylabel = "Close:";
      d3.select("#Stock-Header").text(`${stockTicker}: Closing Price`);
    } else if (chosenYAxis === "open") {
      ylabel = "Open:";
      d3.select("#Stock-Header").text(`${stockTicker}: Opening Price`);
    } else if (chosenYAxis === "Change") {
      ylabel = "Change:";
      d3.select("#Stock-Header").text(`${stockTicker}: Change in Price for a Day`);
    } else if (chosenYAxis === "upper"){
      ylabel = "Highest Spread:";
      d3.select("#Stock-Header").text(`${stockTicker}: Highest Deviation From Open for a Day`);
    } else if (chosenYAxis === "lower"){
      ylabel = "Lowest Spread:";
      d3.select("#Stock-Header").text(`${stockTicker}: Lowest Deviation From Open for a Day`);
    } else if (chosenYAxis === "volume"){
      ylabel = "Volume:";
      d3.select("#Stock-Header").text(`${stockTicker}: Volume`);
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`Date: ${dateFormatter(d.datetime)}<br>${ylabel} ${d[chosenYAxis]}`);
      });

    circles.call(toolTip);
    circles.on("mouseover", function (data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function (data, index) {
        toolTip.hide(data, this);
      });

    return circles;
  }

  // Get Data
  d3.csv(`${stockTicker}.csv`).then(function (data, err) {
    //if (err) throw err;
    var dateParser = d3.timeParse("%Y-%m-%d");

    // Convert Data
    data.forEach(function (data) {
      data.datetime = dateParser(data.datetime);
      data.open = Number(data.open).toFixed(2);
      data.high = Number(data.high).toFixed(2);
      data.low = Number(data.low).toFixed(2);
      data.close = Number(data.close).toFixed(2);
      data.volume = Number(data.volume).toFixed(0);
      data.upper = Number(data.upper).toFixed(4);
      data.lower = Number(data.lower).toFixed(4);
      data.Change = Number(data.Change).toFixed(4);
      data.CheckBase = Number(data.CheckBase).toFixed(4);
    });
    // Grab values for tables (100)
    var MaxPrice100 = d3.max(data, function(d) { return +d.high; } );
    var MinPrice100 = d3.min(data, function(d) { return +d.low; } );
    var AverageChange100 = d3.mean(data, function(d) { return d.Change; } ).toFixed(4);
    var HighestSpreadFromOpen100 = d3.max(data, function(d) { return +d.upper; } );
    var LowestSpreadFromOpen100 = d3.max(data, function(d) { return +d.lower; } );
    var AverageVolume100 = d3.mean(data, function(d) { return d.volume; } ).toFixed(4);
    var MaxVolume100 = d3.max(data, function(d) { return +d.volume; } );
    var MinVolume100 = d3.min(data, function(d) { return +d.volume; } );

    // Push values for 100 table
    d3.select("#MaxPrice100").text(MaxPrice100);
    d3.select("#MinPrice100").text(MinPrice100);
    d3.select("#AverageChange100").text(AverageChange100);
    d3.select("#HighestSpreadFromOpen100").text(HighestSpreadFromOpen100);
    d3.select("#LowestSpreadFromOpen100").text(LowestSpreadFromOpen100);
    d3.select("#AverageVolume100").text(AverageVolume100);
    d3.select("#MaxVolume100").text(MaxVolume100);
    d3.select("#MinVolume100").text(MinVolume100);

    // Grab values for tables (10)
    var DataLast10Days = data.slice(0, 10);
    var MaxPrice10 = d3.max(DataLast10Days, function(d) { return +d.high; } );
    var MinPrice10 = d3.min(DataLast10Days, function(d) { return +d.low; } );
    var AverageChange10 = d3.mean(DataLast10Days, function(d) { return d.Change; } ).toFixed(4);
    var HighestSpreadFromOpen10 = d3.max(DataLast10Days, function(d) { return +d.upper; } );
    var LowestSpreadFromOpen10 = d3.max(DataLast10Days, function(d) { return +d.lower; } );
    var AverageVolume10 = d3.mean(DataLast10Days, function(d) { return d.volume; } ).toFixed(4);
    var MaxVolume10 = d3.max(DataLast10Days, function(d) { return +d.volume; } );
    var MinVolume10 = d3.min(DataLast10Days, function(d) { return +d.volume; } );

    // Push values for 10 table
    d3.select("#MaxPrice10").text(MaxPrice10);
    d3.select("#MinPrice10").text(MinPrice10);
    d3.select("#AverageChange10").text(AverageChange10);
    d3.select("#HighestSpreadFromOpen10").text(HighestSpreadFromOpen10);
    d3.select("#LowestSpreadFromOpen10").text(LowestSpreadFromOpen10);
    d3.select("#AverageVolume10").text(AverageVolume10);
    d3.select("#MaxVolume10").text(MaxVolume10);
    d3.select("#MinVolume10").text(MinVolume10);

    var xTimeScale = d3.scaleTime().domain([d3.min(data, d => d.datetime), d3.max(data, d => d.datetime)]).range([0, width]);
    var yLinearScale = yScale(data, chosenYAxis);
    var bottomAxis = d3.axisBottom(xTimeScale).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%d-%b-%y'));
    var leftAxis = d3.axisLeft(yLinearScale);

    // Add X, Y Axis and circles
    chartGroup.append("g").classed("x-axis", true).attr("transform", `translate(0, ${height})`).call(bottomAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", function(d) {
        return "rotate(-65)" 
        })
    var yAxis = chartGroup.append("g").classed("y-axis", true).attr("transform", `translate(0, 0)`).call(leftAxis);
    var circles = chartGroup.selectAll().data(data).enter().append("g");
    var circlesGroup = circles.append("circle").attr("cx", d => xTimeScale(d.datetime)).attr("cy", d => yLinearScale(d[chosenYAxis])).attr("r", 7).attr("fill", "green").attr("opacity", ".8");
    var textsGroup = circles.append("text").attr("x", d => xTimeScale(d.datetime)).attr("y", d => yLinearScale(d[chosenYAxis] - .2)).style("font-size", "12px").style("text-anchor", "middle");

    // X, Y axis label
    chartGroup.append("text").attr("transform", `translate(${width / 3}, ${height + 70})`).classed("axis-text", true).text("Date (DD-MMM-YY)");
    var ylabelsGroup = chartGroup.append("g").attr("transform", `rotate(-90) translate(${-(height / 2)}, ${-20})`);

    var CloseLabel = ylabelsGroup.append("text").attr("x", 0).attr("y", -60).attr("value", "close").classed("active", true).text("Close");
    var OpenLabel = ylabelsGroup.append("text").attr("x", 0).attr("y", -80).attr("value", "open").classed("inactive", true).text("Open");
    var ChangeLabel = ylabelsGroup.append("text").attr("x", 0).attr("y", -100).attr("value", "Change").classed("inactive", true).text("Change");
    var VolumeLabel = ylabelsGroup.append("text").attr("x", 0).attr("y", -120).attr("value", "volume").classed("inactive", true).text("Volume");
    var HighSpreadLabel = ylabelsGroup.append("text").attr("x", 0).attr("y", -140).attr("value", "upper").classed("inactive", true).text("Highest Spread");
    var LowSpreadLabel = ylabelsGroup.append("text").attr("x", 0).attr("y", -160).attr("value", "lower").classed("inactive", true).text("Lowest Spread");

    var circles = updateToolTip(chosenYAxis, circles);

    // y axist event listener
    ylabelsGroup.selectAll("text").on("click", function () {
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        chosenYAxis = value;
        yLinearScale = yScale(data, chosenYAxis);
        yAxis = generateHorizontalAxes(yLinearScale, yAxis);
        circlesGroup = generatePoints(circlesGroup, yLinearScale, chosenYAxis);
        textsGroup = generateTextPoints(textsGroup, yLinearScale, chosenYAxis);
        circles = updateToolTip(chosenYAxis, circles);

        // changes classes to change bold text
        if (chosenYAxis === "close") {
          CloseLabel.classed("active", true).classed("inactive", false);
          OpenLabel.classed("active", false).classed("inactive", true);
          ChangeLabel.classed("active", false).classed("inactive", true);
          VolumeLabel.classed("active", false).classed("inactive", true);
          HighSpreadLabel.classed("active", false).classed("inactive", true);
          LowSpreadLabel.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "open") {
          CloseLabel.classed("active", false).classed("inactive", true);
          OpenLabel.classed("active", true).classed("inactive", false);
          ChangeLabel.classed("active", false).classed("inactive", true);
          VolumeLabel.classed("active", false).classed("inactive", true);
          HighSpreadLabel.classed("active", false).classed("inactive", true);
          LowSpreadLabel.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "Change") {
          CloseLabel.classed("active", false).classed("inactive", true);
          OpenLabel.classed("active", false).classed("inactive", true);
          ChangeLabel.classed("active", true).classed("inactive", false);
          VolumeLabel.classed("active", false).classed("inactive", true);
          HighSpreadLabel.classed("active", false).classed("inactive", true);
          LowSpreadLabel.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "volume") {
          CloseLabel.classed("active", false).classed("inactive", true);
          OpenLabel.classed("active", false).classed("inactive", true);
          ChangeLabel.classed("active", false).classed("inactive", true);
          VolumeLabel.classed("active", true).classed("inactive", false);
          HighSpreadLabel.classed("active", false).classed("inactive", true);
          LowSpreadLabel.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "upper") {
          CloseLabel.classed("active", false).classed("inactive", true);
          OpenLabel.classed("active", false).classed("inactive", true);
          ChangeLabel.classed("active", false).classed("inactive", true);
          VolumeLabel.classed("active", false).classed("inactive", true);
          HighSpreadLabel.classed("active", true).classed("inactive", false);
          LowSpreadLabel.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "lower") {
          CloseLabel.classed("active", false).classed("inactive", true);
          OpenLabel.classed("active", false).classed("inactive", true);
          ChangeLabel.classed("active", false).classed("inactive", true);
          VolumeLabel.classed("active", false).classed("inactive", true);
          HighSpreadLabel.classed("active", false).classed("inactive", true);
          LowSpreadLabel.classed("active", true).classed("inactive", false);
        } else {
          CloseLabel.classed("active", true).classed("inactive", false);
          OpenLabel.classed("active", false).classed("inactive", true);
          ChangeLabel.classed("active", false).classed("inactive", true);
          VolumeLabel.classed("active", false).classed("inactive", true);
          HighSpreadLabel.classed("active", false).classed("inactive", true);
          LowSpreadLabel.classed("active", false).classed("inactive", true);
        }
      }
    });
  }).catch(function (error) {
    console.log(error);
  });
}

GraphSetUp("AIXXF");