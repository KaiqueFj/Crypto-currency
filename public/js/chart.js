import "chartjs-adapter-date-fns"; // or 'chartjs-adapter-moment'
import Chart from "chart.js/auto";
import axios from "axios";
import { format } from "date-fns";

export async function fetchCoinData(coin) {
  try {
    const response = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=brl&days=7`,
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

export async function createChartForAllCoins(coin) {
  try {
    const { labels, prices } = await getChartData(coin);

    const initialPrice = prices[prices.length - 2];
    const finalPrice = prices[prices.length - 1];
    const isUp = finalPrice >= initialPrice;

    const lineColor = isUp ? "#10b981" : "#f87171";

    const ctx = document.getElementById(`chart-${coin}`).getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `${coin} price`,
            data: prices,
            borderColor: lineColor, // Orange color for the line
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

export async function createUniqueChart(coin) {
  try {
    const { labels, prices } = await getChartData(coin);

    // Format the labels (dates) using date-fns
    const formattedLabels = labels.map((dateString) => {
      const date = new Date(dateString);
      return format(date, "MMM-dd");
    });

    // Use a Map to get the first occurrence of each day
    const uniqueLabelsMap = new Map();
    for (let i = 0; i < formattedLabels.length; i++) {
      const date = formattedLabels[i];
      if (!uniqueLabelsMap.has(date)) {
        uniqueLabelsMap.set(date, prices[i]);
      }
    }

    // Extract unique labels and prices from the Map
    const uniqueLabels = Array.from(uniqueLabelsMap.keys());
    const uniquePrices = Array.from(uniqueLabelsMap.values());

    console.log(uniqueLabels);

    const initialPrice = uniquePrices[uniquePrices.length - 2];
    const finalPrice = uniquePrices[uniquePrices.length - 1];
    const isUp = finalPrice >= initialPrice;

    const lineColor = isUp ? "#10b981" : "#f87171";

    const ctx = document.getElementById(`chart-${coin}`).getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: uniqueLabels,
        datasets: [
          {
            label: `${coin} price`,
            data: uniquePrices,
            borderColor: "#10b981", // Green color for the line
            borderWidth: 3, // Thicker line
            pointBackgroundColor: "#10b981", // Green color for dots
            pointBorderColor: "#fff", // White color for dot borders
            pointBorderWidth: 2,
            pointRadius: 3,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: {
                size: 12,
              },
              color: "#333",
            },
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context) {
                return context.dataset.label + ": " + context.raw;
              },
            },
          },
          title: {
            display: true,
            text: "Chart Title",
            font: {
              size: 16,
            },
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Date",
              font: {
                size: 14,
              },
            },
            ticks: {
              color: "#333",
              font: {
                size: 12,
              },
            },
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)", // Color of x-axis grid lines
            },
          },
          y: {
            display: true,
            position: "right", // Positioning y-axis on the right
            title: {
              display: true,
              text: "Price",
              font: {
                size: 14,
              },
            },
            ticks: {
              color: "#333",
              font: {
                size: 12,
              },
              beginAtZero: true,
            },
            grid: {
              display: false, // Hide y-axis grid lines
            },
          },
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
        elements: {
          line: {
            tension: 0.4,
            borderWidth: 3, // Thicker line
            borderColor: "#10b981", // Green line color
            fill: false, // No fill under the line
          },
          point: {
            radius: 3, // Point radius
            backgroundColor: "#10b981", // Point color
            borderWidth: 2, // Point border width
            borderColor: "#FFFFFF", // Point border color
            hoverRadius: 7, // Point radius on hover
            hoverBackgroundColor: "#FF5722", // Point color on hover
            hoverBorderWidth: 3, // Point border width on hover
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    });
  } catch (err) {
    console.error("Error creating chart:", err);
  }
}
