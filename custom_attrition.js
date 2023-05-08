const visObject = {
  options: {
    chart_title: {
      type: "string",
      label: "Chart Title",
      default: "Employee Data"
    }
  },

  create: function (element, config) {
    element.innerHTML = "<h1>Ready to render!</h1>";
  },

  updateAsync: function (data, element, config, queryResponse, details, doneRendering) {
    var margin = { top: 20, right: 20, bottom: 30, left: 120 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
      .range([0, width]);
    var y = d3.scaleBand()
      .range([height, 0])
      .padding(0.1);

    element.innerHTML = "";

    var svg = d3.select("#vis").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    employeeData = []

    data.forEach(function(d) {
      employeeData.push(d["employee_data"]);
    });

    employeeData = [
      { job_level: "Entry", headcount: 50, new_hires: 10, leavers: 2 },
      { job_level: "Mid", headcount: 35, new_hires: 8, leavers: 3 },
      { job_level: "Senior", headcount: 25, new_hires: 5, leavers: 1 },
      { job_level: "Management", headcount: 15, new_hires: 2, leavers: 0 },
      { job_level: "Executive", headcount: 5, new_hires: 1, leavers: 0 }
    ];

    const max_value = d3.max(employeeData, function (d) { return d.headcount + d.new_hires + d.leavers; });

    x.domain([0, max_value]);
    y.domain(employeeData.map(function (d) { return d.job_level; }));

    const middlePoint = max_value / 2;

x.domain([0, max_value]);

// Calculate the total (headcount + new hires + leavers)
const total = d3.sum(employeeData, function (d) { return d.headcount + d.new_hires + d.leavers; });

x.domain([0, 1]); // Set x domain to represent percentages


// Remove the x-axis
// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x));

// Add new hires bars (to the left of the central tendency)
const newHiresBars = svg.selectAll(".new-hires-bar")
  .data(employeeData)
  .enter().append("rect")
  .attr("class", "new-hires-bar")
  .attr("style", "fill: #D0F0C0;")
  .attr("x", 0)
  .attr("y", function (d) { return y(d.job_level); })
  .attr("width", function (d) { return x(d.new_hires / total); })
  .attr("height", y.bandwidth() / 2);

// Add headcount bars (to the right of the central tendency)
const headcountBars = svg.selectAll(".headcount-bar")
  .data(employeeData)
  .enter().append("rect")
  .attr("class", "headcount-bar")
  .attr("style", "fill: #8fa9dc;")
  .attr("x", function (d) { return x(0.5 - (d.headcount / total) / 2); }) // Start at the middle point minus half of the headcount bar width
  .attr("y", function (d) { return y(d.job_level); })
  .attr("width", function (d) { return x(d.headcount / total); })
  .attr("height", y.bandwidth() / 2);

// Add leavers bars (to the right of the x-axis)
const leaversBars = svg.selectAll(".leavers-bar")
  .data(employeeData)
  .enter().append("rect")
  .attr("class", "leavers-bar")
  .attr("style", "fill: #e74c3c;")
  .attr("x", function (d) { return x(1 - d.leavers / total); }) // Start at the right of the x-axis
  .attr("y", function (d) { return y(d.job_level); })
  .attr("width", function (d) { return x(d.leavers / total); })
  .attr("height", y.bandwidth() / 2);

function addPercentageLabels(bars, property, xOffset) {
  bars.data().forEach((d, i) => {
    svg.append('text')
      .attr('x', x(xOffset(d)) + 5)
      .attr('y', y(d.job_level) + y.bandwidth() / 4)
      .attr('font-size', '12px')
      .text(((d[property] / total) * 100).toFixed(1) + '%');
  });
}

addPercentageLabels(newHiresBars, 'new_hires', d => 0);
addPercentageLabels(headcountBars, 'headcount', d => 0.5 - (d.new_hires / total) / 2);
addPercentageLabels(leaversBars, 'leavers', d => 1 - d.leavers / total);

// ...


    // Add the x Axis
    // svg.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add a legend
    // var legend = svg.append("g")
    //   .attr("class", "legend")
    //   .attr("transform", "translate(" + (width - 150 ) + "," + (height-450) + ")");

    // legend.append("rect")
    //   .attr("class", "headcount-bar")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("width", 20)
    //   .attr("height", 20)
    //   .attr("style", "fill: #6c43e0;");

    // legend.append("text")
    //   .attr("x", 25)
    //   .attr("y", 15)
    //   .text("Headcount")
    //   .attr("font-size", "12px");

    // legend.append("rect")
    //   .attr("class", "new-hires-bar")
    //   .attr("x", 0)
    //   .attr("y", 25)
    //   .attr("width", 20)
    //   .attr("height", 20)
    //   .attr("style", "fill: #3ebcb3;");

    // legend.append("text")
    //   .attr("x", 25)
    //   .attr("y", 40)
    //   .text("New Hires")
    //   .attr("font-size", "12px");

    // legend.append("rect")
    //   .attr("class", "leavers-bar")
    //   .attr("x", 0)
    //   .attr("y", 50)
    //   .attr("width", 20)
    //   .attr("height", 20)
    //   .attr("style", "fill: #e74c3c;");

    // legend.append("text")
    //   .attr("x", 25)
    //   .attr("y", 65)
    //   .text("Leavers")
    //   .attr("font-size", "12px");
// Add category labels at the top of each category
function addCategoryLabel(xOffset, widthFactor, label) {
  svg.append('text')
    .attr('x', x(xOffset) + x(widthFactor) / 2)
    .attr('y', -5)
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text(label);
}

const headcountWidthFactor = employeeData[0].headcount / total;

addCategoryLabel(0, 0, 'New Hires');
addCategoryLabel(0.5 - headcountWidthFactor / 2, headcountWidthFactor, 'Headcount');
addCategoryLabel(1 - employeeData[0].leavers / total, 0, 'Leavers');



    doneRendering();
  }
};

looker.plugins.visualizations.add(visObject);
