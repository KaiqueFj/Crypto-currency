import "chartjs-adapter-date-fns"; // or 'chartjs-adapter-moment'
import Chart from "chart.js/auto";
import axios from "axios";

export async function fetchCoinData(coin) {
  try {
    const response = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`,
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

export async function getChartData(coin) {
  try {
    const data = await fetchCoinData(coin);
    const labels = data.prices.map((price) => new Date(price[0]));
    const prices = data.prices.map((price) => price[1]);
    return { labels, prices };
  } catch (err) {
    console.error("Error fetching chart data:", err);
    return { labels: [], prices: [] };
  }
}

export async function createChart(coin) {
  try {
    const { labels, prices } = await getChartData(coin);

    const ctx = document.getElementById(`chart-${coin}`).getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `${coin} price`,
            data: prices,
            borderColor: "#9bfc9b", // Orange color for the line
            borderWidth: 1,
            pointBackgroundColor: "#0000", // Orange color for dots
            pointBorderColor: "#ffff", // Orange color for dot borders
            pointBorderWidth: 2,
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Disable maintaining aspect ratio

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
            borderWidth: 1, // Thinner line
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
