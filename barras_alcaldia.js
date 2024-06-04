function drawBarrasAlcaldia(colorRange) {

d3.csv("data/barras_alcaldia.csv", d3.autoType).then((data) => {
  const keys = data.columns.slice(1); // Excluyendo la columna 'name'

  // Transformar datos para d3.stack()
  const series = d3.stack().keys(keys)(
    data.map((d) => {
      let obj = { state: d.name };
      keys.forEach((key) => (obj[key] = d[key]));
      return obj;
    })
  );

  const margin = { top: 5, right: 150, bottom: 75, left: 50 },
    fullWidth = window.innerWidth,
    fullHeight = window.innerHeight,
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom;

  // Escalas
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.name)) // Incluye tanto año como mes
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
    .rangeRound([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal().domain(keys).range(colorRange);

  // SVG
  const svg = d3
    .select("#barras_alcaldia")
    .append("svg")
    .attr("width", 0.5 * fullWidth)
    .attr("height", 0.5 * fullHeight)
    .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Grupos y rectángulos para cada parte del stack
  svg
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d.map(item => ({...item, key: d.key, state: item.data.state.replace(/\.$/, "").trim()})))
    .join("rect")
    .attr("x", (d) => x(d.data.state))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    // .append("title")
    // .text((d) => `${d.data.state}: ${d.key} ${d[1] - d[0]}`)
    ;

  // Ejes
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat((d) => d.split("-")[1])
    ) // Mostrar solo el mes
    .selectAll("text")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "end")
    .attr("dy", "-0.5em")
    .attr("dx", "-0.5em")
    .style("font-size", "18px");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("class", "axis");
    
  // Añadir leyenda al SVG
  const legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width - margin.right + 10}, ${margin.top})`
    );

  const legendItemHeight = 30;
  const legendSpacing = 4;

  keys.forEach((key, index) => {
    const legendRow = legend
      .append("g")
      .attr(
        "transform",
        `translate(0, ${index * (legendItemHeight + legendSpacing)})`
      );

    legendRow
      .append("rect")
      .attr("width", legendItemHeight)
      .attr("height", legendItemHeight)
      .attr("fill", color(key));

    legendRow
      .append("text")
      .attr("x", legendItemHeight + 8)
      .attr("y", legendItemHeight / 2)
      .attr("dominant-baseline", "middle")
      .text(key);
  });

  // Añadir etiquetas de años
  const yearPositions = { 2022: 12, 2023: 12, 2024: 2 };
  const yearOffsets = { 2022: 0, 2023: 12, 2024: 24 };

  Object.keys(yearPositions).forEach((year) => {
    const months = yearPositions[year];
    const offset = yearOffsets[year];
    const yearPos = x.bandwidth() + x.step() * (offset + months / 2);

    svg
      .append("text")
      .attr("x", yearPos)
      .attr("y", height + margin.top + margin.bottom - 20)
      .attr("text-anchor", "middle")
      .attr("class", "axis")
      .text(year);
  });

  var tooltip = d3.select("#tooltip");
  svg.selectAll("rect")
  .on("mouseover", function (event, d) {
    tooltip
      .style("opacity", 1)
      .html(
        "Periodo: " + d.state + "<br>" +
        "Alcaldía: " + d.key + "<br>" +
        "Accidentes: " +
          (d[1] - d[0])
        
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 28 + "px");
  })
  .on("mouseout", function () {
    tooltip.style("opacity", 0);
  });
});

}


