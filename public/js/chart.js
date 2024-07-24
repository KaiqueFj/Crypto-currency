import "chartjs-adapter-date-fns"; // or 'chartjs-adapter-moment'
import Chart from "chart.js/auto";
import axios from "axios";

export async function fetchCoinData() {
  try {
    const response = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7`,
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    const data = response.data;
    return data;
  } catch (err) {
    console.error("Error fetching coin data:", err);
    throw err;
  }
}

export async function getChartData() {
  try {
    const data = await fetchCoinData();
    const labels = data.prices.map((price) => new Date(price[0]));
    const prices = data.prices.map((price) => price[1]);
    return { labels, prices };
  } catch (err) {
    console.error("Error fetching chart data:", err);
    return { labels: [], prices: [] };
  }
}

export async function createChart() {
  try {
    const { labels, prices } = await getChartData();
    console.log(labels, prices);
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Bitcoin Price (USD)",
            data: prices,
            borderColor: "#9bfc9b", // Orange color for the line
            borderWidth: 2,
            pointBackgroundColor: "#0000", // Orange color for dots
            pointBorderColor: "#ffff", // Orange color for dot borders
            pointBorderWidth: 2,
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Hide legend
          },
        },
        scales: {
          x: {
            display: false, // Hide x-axis labels and title
          },
          y: {
            display: false, // Hide y-axis labels and title
          },
        },
        layout: {
          padding: {
            top: 2,
            bottom: 2,
          },
        },
        elements: {
          line: {
            tension: 0.4, // Smooth curves
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
      },
    });
  } catch (err) {
    console.error("Error creating chart:", err);
  }
}
