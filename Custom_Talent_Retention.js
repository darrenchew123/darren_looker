const visObject = {
  options: {
    first_option: {
      type: "string",
      label: "My First Option",
      default: "Default Value"
    },
    second_option: {
      type: "number",
      label: "My Second Option",
      default: 42
    }
  },

  create: function(element, config){
    element.innerHTML = "<h1>Ready to render!</h1>";
  },

updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
              .range([0, width]);

    var y = d3.scaleBand()
              .range([height, 0])
              .padding(0.4);

    element.innerHTML = "";
    var svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    formattedData = [];

    data.forEach(function(d) {
      formattedData.push({
        count: d["game.count"]["value"],
        friendly_class: d["game.friendly_class"]["value"],
        opponent_class: d["game.opponent_class"]["value"]
      });
    });

    x.domain([0, d3.max(formattedData, function(d) { return d.count; })]);
    y.domain(formattedData.map(function(d) { return d.friendly_class; }));

    svg.selectAll(".bar")
      .data(formattedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("style", "fill: #6c43e0;")
      .attr("y", function(d) { return y(d.friendly_class); })
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", function(d) { return x(d.count); });

    // Add a vertical line to each bar
    svg.selectAll(".line")
      .data(formattedData)
      .enter().append("line")
      .attr("class", "line")
      .attr("x1", function(d) { return x(d.count) ; })
      .attr("y1", function(d) { return y(d.friendly_class) - 5 ; })
      .attr("x2", function(d) { return x(d.count) ; })
      .attr("y2", function(d) { return y(d.friendly_class) + y.bandwidth()+ 5; })
      .attr("stroke", "red")
      .attr("stroke-width", 4);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    doneRendering();
}


};

looker.plugins.visualizations.add(visObject);
