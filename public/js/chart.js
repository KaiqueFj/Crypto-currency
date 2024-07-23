import "chartjs-adapter-date-fns"; // or 'chartjs-adapter-moment'
import Chart from "chart.js/auto";
import axios from "axios";

export async function fetchCoinData() {
  try {
    const response = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30`,
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
            data: prices, // Include the data here
            borderColor: "rgba(255, 165, 0, 1)", // Orange color for the line
            borderWidth: 2,
            pointBackgroundColor: "rgba(255, 165, 0, 1)", // Orange color for dots
            pointBorderColor: "rgba(255, 165, 0, 1)", // Orange color for dot borders
            pointBorderWidth: 2,
            pointRadius: 4,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 165, 0, 1)", // Orange color for the legend
              font: {
                size: 14,
              },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
            ticks: {
              color: "rgba(255, 165, 0, 1)", // Orange color for x-axis labels
            },
            title: {
              display: true,
              text: "Date",
              color: "rgba(255, 165, 0, 1)", // Orange color for x-axis title
              font: {
                size: 16,
              },
            },
          },
          y: {
            ticks: {
              color: "rgba(255, 165, 0, 1)", // Orange color for y-axis labels
            },
            beginAtZero: false,
            title: {
              display: true,
              text: "Price (USD)",
              color: "rgba(255, 165, 0, 1)", // Orange color for y-axis title
              font: {
                size: 16,
              },
            },
          },
        },
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error creating chart:", err);
  }
}
