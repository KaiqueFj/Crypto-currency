// chartUtils.js
import Chart from "chart.js/auto";

export function saveChartAsImage(format, coinName) {
  const coinElement = document.querySelector(`[data-coin="${coinName}"]`);
  if (coinElement) {
    const chartCanvas = document.getElementById(`chart-${coinName}`);

    if (chartCanvas) {
      const chart = Chart.getChart(chartCanvas);

      if (chart) {
        const image = chartCanvas.toDataURL(`image/${format}`);
        const link = document.createElement("a");

        link.href = image;
        link.download = `${coinName}-chart.${format}`;
        link.click();
      }
    }
  }
}

export function saveChartAsPdf(coinName) {
  const coinElement = document.querySelector(`[data-coin="${coinName}"]`);
  if (coinElement) {
    const chartCanvas = document.getElementById(`chart-${coinName}`);

    if (chartCanvas) {
      const chart = Chart.getChart(chartCanvas);

      if (chart) {
        const image = chartCanvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.addImage(image, "PNG", 10, 10, 190, 100);
        pdf.save(`${coinName}-chart.pdf`);
      }
    }
  }
}
