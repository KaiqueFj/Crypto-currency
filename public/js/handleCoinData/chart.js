import 'chartjs-adapter-date-fns'; // or 'chartjs-adapter-moment'
import Chart from 'chart.js/auto';
import axios from 'axios';
import { format } from 'date-fns';
export { Chart }; // Export Chart for use in other files

let chartInstances = {};

export async function fetchCoinData(coin, days = 7) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=brl&days=${days}`,
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.API_KEY_Cry,
      },
    });

    const data = response.data;
    return data;
  } catch (err) {
    console.error('Error fetching coin data:', err);
    throw err;
  }
}

export async function getChartData(coin, days) {
  try {
    const data = await fetchCoinData(coin, days);
    const labels = data.prices.map((price) => new Date(price[0]));
    const prices = data.prices.map((price) => price[1]);

    return { labels, prices };
  } catch (err) {
    console.error('Error fetching chart data:', err);
    return { labels: [], prices: [] };
  }
}

export async function createChartForAllCoins(coin, days) {
  try {
    const { labels, prices } = await getChartData(coin, days);

    const initialPrice = prices[prices.length - 2];
    const finalPrice = prices[prices.length - 1];
    const isUp = finalPrice >= initialPrice;

    const lineColor = isUp ? '#10b981' : '#f87171';

    const ctx = document.getElementById(`chart-${coin}`).getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${coin} price`,
            data: prices,
            borderColor: lineColor, // Orange color for the line
            borderWidth: 1,
            pointBackgroundColor: '#0000', // Orange color for dots
            pointBorderColor: '#ffff', // Orange color for dot borders
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
          tooltip: {
            enabled: false, // Disable the tooltip on hover
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
          mode: 'nearest',
        },
      },
    });
  } catch (err) {
    console.error('Error creating chart:', err);
  }
}

export async function createUniqueChart(coin, days) {
  try {
    const { labels, prices } = await getChartData(coin, days);

    // Format the labels (dates) using date-fns
    const formattedLabels = labels.map((dateString) => {
      const date = new Date(dateString);
      return format(date, 'MMM-dd');
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

    const initialPrice = uniquePrices[uniquePrices.length - 2];
    const finalPrice = uniquePrices[uniquePrices.length - 1];
    const isUp = finalPrice >= initialPrice;

    const lineColor = isUp ? '#10b981' : '#f87171';

    const lineColorWithOpacity = isUp
      ? 'rgba(16, 185, 129, 0.1)'
      : 'rgba(248, 113, 113, 0.1)';

    const ctx = document.getElementById(`chart-${coin}`).getContext('2d');

    // Check if a chart instance already exists and destroy it
    if (chartInstances[coin]) {
      chartInstances[coin].destroy();
    }

    chartInstances[coin] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: uniqueLabels,
        datasets: [
          {
            label: `${coin} price`,
            data: uniquePrices,
            borderColor: lineColor, // Green color for the line
            borderWidth: 2, // Thicker line
            pointBackgroundColor: lineColor, // Green color for dots
            backgroundColor: lineColorWithOpacity, // Green color for
            pointBorderColor: lineColor, // White color for dot borders
            pointBorderWidth: 2,
            pointRadius: 0,
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#000000',
            bodyColor: '#333333',
            borderColor: '#dddddd',
            borderWidth: 1,
            cornerRadius: 4,
            displayColors: false,
          },
        },

        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            display: true,
            position: 'right', // Positioning y-axis on the right
            ticks: {
              color: lineColor,
              font: {
                size: 12,
              },
              beginAtZero: true,
              callback: (value) => `${value.toLocaleString()} K`,
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
            left: 30,
            right: 30,
          },
        },
      },
    });
  } catch (err) {
    console.error('Error creating chart:', err);
  }
}
