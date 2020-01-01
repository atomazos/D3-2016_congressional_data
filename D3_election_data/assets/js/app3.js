
// Set the dimensions and margins of the graph

var svgWidth = 1060;
var svgHeight = 800;

var margin = {
  top: 90,
  right: 80,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("assets/data/data.csv").then(function (data) {
  console.log(data);


  // Step 1: Parse Data/Cast as numbers
  // // ==============================
  // data.forEach(function (data) {
  //   data.acs_medianincome = +data.acs_medianincome;
  //   data.acs_population_adult_white= +acs_population_adult_white;
  // });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([0, 280000])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([90,0])
    .range([0, height]);

  //   // Step 3: Create axis functions
  //   // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //   // Step 4: Append Axes to the chart
  //   // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //   // Step 5: Create Circles
  //   // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.qvote_president_republican))
    .attr("cy", d => yLinearScale(d.noncollege_white_share))
    .attr("r", "10")
    .attr("stroke", "black")
    .attr("fill", d => {
      var party = d.party
      if (party === "Republican") {
        return "#E9141D";
      } else if (party === "Democratic") {
        return "#00AEF3";
      } else {
        return "green"
      }
    })
    .attr("opacity", ".7");






  // var textGroup = chartGroup.selectAll("stateText")
  // .data(data)
  // .enter()
  // .append("text")
  // .text(d => d.code)
  // .attr("class", "stateText")
  // .attr("x", d => xLinearScale(d.acs_medianincome))
  // .attr("y", d => yLinearScale(d.acs_population_adult_white));


  // Step 7: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function (d) {
      return (`District: ${d.district}<br> Rep. ${d.first_name} ${d.last_name} (${d.party[0]})<br> First elected in ${d.first_elected}<br> Results:<br> •District: D: ${d.rvotepercent_house_democrat}% / R: ${d.rvotepercent_house_republican}% <br> •National: D: ${d.votepercent_president2016_democrat}% / R: ${d.votepercent_president2016_republican}%<br> ------------<br> Total votes for Trump: ${d.qvote_president_republican} of ${d.tvotetotal_president} cast<br>Non-college whites: ${d.noncollege_white_share}%<br> Median income rank: #${d.acs_medianincome_rank} 0f 435 districts`);
    });

  // Step 8: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);
  d3.select(".d3-tip")
    .data(data)
  // .enter()
  // .append("text")
  // .style("background-color", d=>{
  //   var party = d.party
  //   if (party === "Republican") {
  //     return "red";
  //   } else if (party === "Democratic") {
  //     return "blue";
  //   } else { 
  //     return "green"
  //   }})

  // Step 9: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });


  // Step. 10 Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 5)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Share of Non-College Whites  (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top - 40})`)
    .attr("class", "aText")
    .text("Total Votes for Trump")
}).catch(function (error) {
  console.log(error);
});