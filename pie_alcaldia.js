function drawPieAlcaldia(colorRange) {

// Define las dimensiones del gráfico
const margin = { top: 5, right: 150, bottom: 50, left: 50 },
  fullWidth = window.innerWidth,
  fullHeight = window.innerHeight,
  width = fullWidth - margin.left - margin.right,
  height = fullHeight - margin.top - margin.bottom;

// Función para cargar los datos y crear el gráfico
d3.csv("data/pie_alcaldia.csv").then((data) => {
  // Transforma los datos a tipos adecuados
  data.forEach((d) => {
    d.value = +d.value; // Asegúrate de que el valor es numérico
  });

  // Calcula el total de los valores
  const total = d3.sum(data, (d) => d.value);

  // Añade un campo para el porcentaje relativo
  data.forEach((d) => {
    d.percentage = ((d.value / total) * 100).toFixed(2); // Calcula el porcentaje
  });

  // Crea la escala de colores
  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(colorRange);

// var color = d3.scaleOrdinal(d3.schemeTableau10);

  // Crea el layout del pie y el generador de arcos
  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.value);

  // Aumenta el tamaño del radio externo del gráfico de torta
  const arc = d3
    .arc()
    .innerRadius(Math.min(width, height) / 5)
    .outerRadius(Math.min(width, height) / 2); // Aumenta el radio externo en 20

  const arcs = pie(data);

  // Crea el contenedor SVG
  const svg = d3
    .select("#pie_alcaldia")
    .append("svg")
    .attr("width", 0.5 * fullWidth)
    .attr("height", 0.5 * fullHeight)
    .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Añade una ruta de sector para cada valor
  svg
    .append("g")
    .attr("stroke", "white")
    .attr("transform", `translate(${width / 2 - margin.right}, ${fullHeight / 2})`)
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("fill", (d) => color(d.data.name))
    .attr("d", arc)
;

  // Añade un cuadro de texto para las etiquetas
  const legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width - margin.right}, ${(margin.top + margin.bottom) / 2})`
    );

  legend
    .selectAll("rect")
    .data(arcs)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 40) // Ajusta el espaciado vertical entre las etiquetas
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d) => color(d.data.name));

  legend
    .selectAll("text")
    .data(arcs)
    .enter()
    .append("text")
    .attr("x", 24)
    .attr("y", (d, i) => i * 40 + 9) // Ajusta el espaciado vertical entre las etiquetas
    .attr("dy", "15px")
    .style("text-anchor", "start")
    .call((text) =>
      text
        .append("tspan")
        .attr("x", 24)
        .attr("dy", "0em")
        .attr("font-weight", "bold")
        .text((d) => d.data.name)
    )
    .call((text) =>
      text
        .append("tspan")
        .attr("x", 24)
        .attr("dy", "1.2em")
        .attr("fill-opacity", 0.7)
        .text((d) => d.data.value.toLocaleString("en-US"))
    )
    .call((text) =>
      text
        .append("tspan")
        .attr("dx", "0.8em") // Ajusta la separación entre el número y el porcentaje
        .attr("fill-opacity", 0.7)
        .text((d) => `(${d.data.percentage}%)`)
    );

    var tooltip = d3.select("#tooltip");
    svg.selectAll("path")
    .on("mouseover", function (event, d) {
      tooltip
        .style("opacity", 1)
        .html(
          "Alcaldía: " +
          d.data.name + "<br>" +
          "Cantidad: " + d.data.value.toLocaleString("en-US") + "<br>" +
          "Porcentaje: " + d.data.percentage + "%"

        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });
});

}




