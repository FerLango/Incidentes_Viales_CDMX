function drawHeatmapHora(interpolator) {
  const margin = { top: 50, right: 100, bottom: 150, left: 200 },
    fullWidth = window.innerWidth,
    fullHeight = window.innerHeight,
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom;

  const svg = d3
    .select("#heatmap_hora")
    .append("svg")
    .attr("width", 0.5 * fullWidth)
    .attr("height", 0.5 * fullHeight)
    .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/heatmap_hora.csv").then(function (data) {
    const horas = [...new Set(data.map((d) => d.hora))].sort((a, b) => a - b);
    const tipos = [...new Set(data.map((d) => d.tipo_incidente))].sort();

    const maxDataValue = d3.max(data, (d) => +d.cantidad);
    const minDataValue = d3.min(data, (d) => +d.cantidad);

    const maxDataEntry = data.find((d) => +d.cantidad === maxDataValue);
    const maxDataTipo = maxDataEntry.tipo_incidente;
    const maxDataHora = maxDataEntry.hora;

    const xScale = d3.scaleBand().domain(horas).range([0, width]).padding(0.05);

    const yScale = d3
      .scaleBand()
      .domain(tipos)
      .range([0, height])
      .padding(0.05);

    const colorScale = d3
      .scaleSequentialLog()
      .domain([1, maxDataValue])
      .interpolator(interpolator);

    const rects = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.hora))
      .attr("y", (d) => yScale(d.tipo_incidente))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => (d.cantidad > 0 ? colorScale(d.cantidad) : "#ccc"));

      // Calcular el total de accidentes por hora
      const accidentesPorHora = d3.rollup(data, v => d3.sum(v, d => +d.cantidad), d => d.hora);
      const totalesPorHora = Array.from(accidentesPorHora, ([hora, total]) => ({hora, total}));

      const formatKilo = d3.format(".1s");

      const xAxisTop = d3.axisTop(xScale)
          .tickFormat((d, i) => formatKilo(totalesPorHora[i].total));

      svg.append("g")
      .attr("class", "axis")
      .call(xAxisTop);
  
      svg.append("text")
      .attr("x", width/2 - margin.left)  
      .attr("y", -margin.top + 20) 
      .text("Incidentes totales por hora")
      .attr("class", "axis-label");

      // Calcular el total de accidentes por causa
      const accidentesPorTipo = d3.rollup(data, v => d3.sum(v, d => +d.cantidad), d => d.tipo_incidente);
      const totalesPorTipo = Array.from(accidentesPorTipo, ([tipo, total]) => ({tipo, total}));

      const yAxisRight = d3.axisRight(yScale)
          .tickFormat((d, i) => formatKilo(totalesPorTipo[i].total));
      
      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxisRight);

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("y", width + margin.right - 20)
      .attr("x", -height/2)
      .text("Incidentes totales por tipo")
      .attr("class", "axis-label");

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(xScale));

      svg
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Hora del día");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", - height / 2)
      .text("Tipo de incidente");

    // svg
    //   .selectAll(".porcentaje-texto")
    //   .data(porcentajesPorTipo)
    //   .enter()
    //   .append("text")
    //   .attr("class", "axis-label")
    //   .attr("x", width + 10)
    //   .attr("y", (d) => yScale(d.tipo) + yScale.bandwidth() / 2)
    //   .attr("dy", ".35em")
    //   .text((d) => `${d.porcentaje}%`);

    const legendHeight = 30;
    const legendWidth = 300;
    const legendMargin = 20;

    const legend = svg
    .append("g")
    .attr("transform", `translate(${legendMargin - margin.left}, ${height + margin.bottom - legendHeight - legendMargin})`);

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    const legendColorScale = d3
      .scaleSequentialLog()
      .domain([1, 15000])
      .interpolator(interpolator);

    gradient
      .selectAll("stop")
      .data(d3.range(0, 1.1, 0.1))
      .enter()
      .append("stop")
      .attr("offset", (d) => `${d * 100}%`)
      .attr("stop-color", (d) => legendColorScale(Math.pow(10, d * 3.8 - 1)));

    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#gradient)");

    const legendScale = d3
      .scaleLog()
      .domain([1, 15000])
      .range([0, legendWidth]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .ticks(3)
      .tickFormat(d3.format(".0s"));
    legend
      .append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis);

    legend
      .append("text")
      .attr("class", "legend-title")
      .attr("x", legendWidth / 2)
      .attr("y", -10)
      .style("text-anchor", "middle")
      .text("Cantidad de Accidentes")
      .style("font-size", "25px")
      .style("fill", "#000");

    const minColor = colorScale(minDataValue);
    const maxColor = colorScale(maxDataValue);

    legend
      .append("rect")
      .attr("x", legendWidth + legendMargin)
      .attr("y", legendHeight - legendMargin * 2)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", minColor);

    legend
      .append("text")
      .attr("x", legendWidth + legendMargin * 2 + 5)
      .attr("y", legendHeight - legendMargin)
      .style("text-anchor", "start")
      .style("font-size", "20px")
      .style("fill", "#000")
      .text(`El mínimo de accidentes es: ${minDataValue}`);

    legend
      .append("rect")
      .attr("x", legendWidth + legendMargin)
      .attr("y", legendHeight - legendMargin + 5)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", maxColor);

    legend
      .append("text")
      .attr("x", legendWidth + legendMargin * 2 + 5)
      .attr("y", legendHeight)
      .style("text-anchor", "start")
      .style("font-size", "20px")
      .style("fill", "#000")
      .text(
        `El máximo de accidentes es: ${maxDataValue} y corresponde al tipo ${maxDataTipo} y a la hora ${maxDataHora} `
      );

    var tooltip = d3.select("#tooltip");

    rects
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            "Accidentes: " +
              d.cantidad +
              "<br>" +
              "Tipo: " +
              d.tipo_incidente +
              "<br>" +
              "Hora: " +
              d.hora
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
  });
}


