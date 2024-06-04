function drawViolinTiempo(color) {
  const margin = { top: 10, right: 50, bottom: 50, left: 70 },
    fullWidth = window.innerWidth,
    fullHeight = window.innerHeight,
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom;

  const svg = d3
    .select("#violin_tiempo")
    .append("svg")
    .attr("width", 0.5 * fullWidth)
    .attr("height", 0.5 * fullHeight)
    .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Function to convert hh:mm:ss to minutes
  function timeToMinutes(time) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  const daysOrder = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Load the data and compute summary statistics for each day of the week
  d3.csv("data/violin_tiempo.csv").then(function (data) {
    // data = data.filter((d) => timeToMinutes(d.longitud) <= 360);

    data.forEach((d) => {
      d.longitud = timeToMinutes(d.longitud);
    });

    // const maxLongitud = d3.max(data, (d) => d.longitud);
    const maxLongitud = 360;


    // Build and show the Y scale
    const y = d3.scaleLinear().domain([0, maxLongitud]).range([height, 0]);

    svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .text("Minutos de afectación");

    // Build and show the X scale
    const x = d3.scaleBand().range([0, width]).domain(daysOrder).padding(0.05); // Space between groups

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x));

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Día de la semana");

    // Features of the histogram
    const histogram = d3
      .histogram()
      .domain(y.domain())
      .thresholds(y.ticks(20)) // Number of bins
      .value((d) => d);

    // Compute the binning for each group of the dataset
    const sumstat = Array.from(
      d3.group(data, (d) => d.dia_semana),
      ([key, value]) => {
        const input = value.map((g) => g.longitud); // Keep the variable called longitud
        const bins = histogram(input); // Compute the binning

        // Calculate quartiles
        const dia_semana = value[0].dia_semana;
const min = Number(d3.min(input).toFixed(2));
const q1 = Number(d3.quantile(input, 0.25).toFixed(2));
const median = Number(d3.quantile(input, 0.5).toFixed(2));
const mean = Number(d3.mean(input).toFixed(2));
const q3 = Number(d3.quantile(input, 0.75).toFixed(2));
const max = Number(d3.max(input).toFixed(2));

        return { key, value: bins, dia_semana, min, q1, median, mean, q3, max }; // Include quartiles in the data
      }
    );

    // Find the maximum number of values in a bin
    let maxNum = 0;
    sumstat.forEach((d) => {
      const longest = d3.max(d.value, (a) => a.length);
      if (longest > maxNum) maxNum = longest;
    });

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    const xNum = d3
      .scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum]);

    // Add the shape to the svg
    svg
      .selectAll("myViolin")
      .data(sumstat)
      .enter()
      .append("g")
      .attr("transform", (d) => "translate(" + x(d.key) + " ,0)")
      .attr("data-quartiles", (d) => `${d.dia_semana},${d.min}, ${d.q1},${d.median},${d.mean},${d.q3},${d.max} `)
      .append("path")
      .datum((d) => d.value)
      .style("stroke", "none")
      .style("fill", color[0])
      .attr(
        "d",
        d3
          .area()
          .x0((d) => xNum(-d.length))
          .x1((d) => xNum(d.length))
          .y((d) => y(d.x0))
          .curve(d3.curveCatmullRom) // Smooth the line to give the violin appearance
      )
      .attr("data-quartiles", (d, i, nodes) => {
        // Access quartile information from the parent <g> element
        const quartiles = d3.select(nodes[i].parentNode).attr("data-quartiles");
        return quartiles;
      });

    var tooltip = d3.select("#tooltip");

    // Assuming you have a selector for the <path> elements representing violin plots
    svg.selectAll("path")
      .on("mouseover", function (event, d) {
        // Retrieve quartile information from the data-quartiles attribute
        const quartiles = d3.select(this).attr("data-quartiles").split(",");
    
        // Construct tooltip content including quartile information
        const tooltipContent = `
          Día: ${quartiles[0]} <br>
          Min: ${quartiles[1]} <br>
          Q1: ${quartiles[2]} <br>
          Mediana: ${quartiles[3]} <br>
          Promedio: ${quartiles[4]} <br>
          Q3: ${quartiles[5]} <br>
          Max: ${quartiles[6]} <br>
        `;
    
        // Show tooltip
        tooltip
          .style("opacity", 1)
          .html(tooltipContent)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        // Hide tooltip
        tooltip.style("opacity", 0);
      });
  });
}
