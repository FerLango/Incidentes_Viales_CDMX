const generalPalette = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939",
    "#8ca252", "#b5cf6b"
  ];
  
  const daltonismFriendlyPalette = [
    "#0000FF", "#ff7f00", "#4daf4a", "#984ea3", "#e41a1c",
    "#a65628", "#a6cee3", "#ffff33", "#999999", "#1b9e77",
    "#ffcc33", "#d62728", "#6a3d9a", "#fb9a99", "#8dd3c7",
    "#bc80bd", "#fdbf6f"
  ];
  
  const paletteSwitches = [
    { id: "heatmap_semana", drawFunction: drawHeatmapSemana, originalColor: d3.interpolateOrRd, colorblindColor: d3.interpolateViridis },
    { id: "heatmap_hora", drawFunction: drawHeatmapHora, originalColor: d3.interpolateOrRd, colorblindColor: d3.interpolateViridis },
    { id: "barras_alcaldia", drawFunction: drawBarrasAlcaldia, originalColor: generalPalette, colorblindColor: daltonismFriendlyPalette },
    { id: "pie_alcaldia", drawFunction: drawPieAlcaldia, originalColor: generalPalette, colorblindColor: daltonismFriendlyPalette },
    { id: "violin_tiempo", drawFunction: drawViolinTiempo, originalColor: generalPalette, colorblindColor: daltonismFriendlyPalette}
  ];
  
  function drawCharts(original) {
    paletteSwitches.forEach(({ id, drawFunction, originalColor, colorblindColor }) => {
      const color = original ? originalColor : colorblindColor;
      d3.select(`#${id}`).selectAll("*").remove();
      drawFunction(color);
    });
    document.getElementById("colorblind-btn").style.display = original ? "block" : "none";
    document.getElementById("original-btn").style.display = original ? "none" : "block";

    if (original) {
      document.body.classList.remove('daltonism');
     } else {
      document.body.classList.add('daltonism');
  }
  }
  
  function addEventListeners() {
    document.getElementById("colorblind-btn").addEventListener("click", () => drawCharts(false));
    document.getElementById("original-btn").addEventListener("click", () => drawCharts(true));
  
    // Add event listener for window resize
    window.addEventListener("resize", () => {
      // Rerun the plots with the current color scheme
      const isOriginal = !document.body.classList.contains('daltonism');
      drawCharts(isOriginal);
    });
  }
  
  // Initial drawing with original colors
  drawCharts(true);
  
  // Add event listeners for buttons
  addEventListeners();
  