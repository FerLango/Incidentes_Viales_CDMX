function drawHeatmapSemana(interpolator) {
  const margin = { top: 5, right: 50, bottom: 200, left: 150 },
    fullWidth = window.innerWidth,
    fullHeight = window.innerHeight,
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom;

  const svg = d3
    .select("#heatmap_semana")
    .append("svg")
    .attr("width", 0.5 * fullWidth)
    .attr("height", 0.5 * fullHeight)
    .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/heatmap_semana.csv").then(function (data) {
    // Filtrar los datos para excluir "Volcadura" y "Vehículo atrapado"
    data = data.filter(
      (d) =>
        d.tipo_incidente !== "Volcadura" &&
        d.tipo_incidente !== "Vehículo atrapado" &&
        d.tipo_incidente !== "Persona atrapada" &&
        d.tipo_incidente !== "Otros" &&
        d.tipo_incidente !== "Ciclista" &&
        d.tipo_incidente !== "Ferroviario" &&
        d.tipo_incidente !== "Monopatín"
    );

    // Generar el array 'tipos' a partir de los datos filtrados
    const tipos = [...new Set(data.map((d) => d.tipo_incidente))].sort();

    const diasSemana = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ];

    const maxDataValue = d3.max(data, (d) => +d.cantidad);
    const minDataValue = d3.min(data, (d) => +d.cantidad);

    // Crear el dominio del eje X fusionando días y horas
    const horasDias = [];
    diasSemana.forEach((dia_semana) => {
      for (let hora = 0; hora < 24; hora++) {
        horasDias.push(`${dia_semana} ${hora}`);
      }
    });

    // Encontrar el tipo de accidente y la hora correspondiente al máximo de accidentes
    const maxDataEntry = data.find((d) => +d.cantidad === maxDataValue);
    const maxDataTipo = maxDataEntry.tipo_incidente;
    const maxDataHora = maxDataEntry.hora;
    const maxDataDia = maxDataEntry.dia_semana;

    const minDataEntry = data.find((d) => +d.cantidad === minDataValue);
    const minDataTipo = minDataEntry.tipo_incidente;
    const minDataHora = minDataEntry.hora;
    const minDataDia = minDataEntry.dia_semana;

    const xScale = d3
      .scaleBand()
      .domain(horasDias)
      .range([0, width])
      .padding(0.0);

    const yScale = d3.scaleBand().domain(tipos).range([0, height]).padding(0.0);

    const colorScale = d3
      .scaleSequentialLog()
      .domain([minDataValue, maxDataValue])
      .interpolator(interpolator);

    const rects = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(`${d.dia_hora}`))
      .attr("y", (d) => yScale(d.tipo_incidente))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => (d.cantidad > 0 ? colorScale(d.cantidad) : "#ccc"));

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 - 3 * width / 7)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Lunes");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 - 2 * width / 7)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Martes");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 - 1 * width / 7)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Miércoles");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 + 0 * width / 7)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Jueves");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 + 1 * width / 7)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Viernes");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 + 2 * width / 7)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Sábado");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2 + 3 * width / 7)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Domingo");

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "axis")
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(horasDias.filter((d, i) => i % 6 === 0))
          .tickFormat((d) => d.split(" ")[1])
      ) // Muestra la hora cada 4 horas
      .selectAll("text");

    svg
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .selectAll(".tick text")
      .each(function () {
        var self = d3.select(this);
        var text = self.text();
        var words = text.split(" ");
        self.text("");
        for (var i = 0; i < words.length; i++) {
          self
            .append("tspan")
            .attr("x", -15)
            .attr("dy", i === 0 ? "-0.7em" : "0.9em")
            .text(words[i]);
        }
      })
      .style("white-space", "pre"); // This ensures the new lines are respected

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + 40 + 40)
      .style("text-anchor", "middle")
      .text("Hora del días y día de la semana");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", - height / 2)
      .attr("y", -margin.left + 20)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Tipo de incidente");

    // Agregar leyenda
    const legendHeight = 30;
    const legendWidth = 300;
    const legendMargin = 20;
  
    const legend = svg
    .append("g")
    .attr("transform", `translate(${legendMargin - margin.left}, ${height + margin.bottom - legendHeight - legendMargin})`);

  const defs = svg.append("defs");
  const gradient = defs
    .append("linearGradient")
    .attr("id", "gradient-weekly")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%");

  gradient
    .selectAll("stop")
    .data(d3.range(0, 1.1, 0.1))
    .enter()
    .append("stop")
    .attr("offset", (d) => `${d * 100}%`)
    .attr("stop-color", (d) => colorScale(Math.pow(10, d * 3.5 - 1)));

  legend
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#gradient-weekly)");

  const legendScale = d3
    .scaleLog()
    .domain([1, maxDataValue])
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
    .text(
      `El mínimo de accidentes es: ${minDataValue} y corresponde al tipo ${minDataTipo} el día ${minDataDia} a la hora ${minDataHora}`
    );

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
      `El máximo de accidentes es: ${maxDataValue} y corresponde al tipo ${maxDataTipo} el día ${maxDataDia} a la hora ${maxDataHora}`
    );

    var tooltip = d3.select("#tooltip");

    rects
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            `Accidentes: ${d.cantidad}<br>Tipo: ${d.tipo_incidente}<br>Día: ${d.dia_semana}<br>Hora: ${d.hora}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
  });
}


