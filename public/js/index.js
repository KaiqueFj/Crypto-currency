import { createChart } from "./chart.js";
document.addEventListener("DOMContentLoaded", () => {
  const coins = document.querySelectorAll("[data-href]");
  coins.forEach((coin) => {
    const coinId = coin.getAttribute("data-href").split("/")[2];
    createChart(coinId);
  });

  const rows = document.querySelectorAll("tr[data-href]");

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = row.dataset.href;
    });
  });
});
