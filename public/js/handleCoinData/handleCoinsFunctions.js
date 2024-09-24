import {
  createChartForAllCoins,
  createUniqueChart,
} from '../handleCoinData/chart.js';
import {
  coinName,
  coins,
  coinsToShow,
  daysInChart,
  dropDownQtdOptions,
  mainTableOfCoins,
  optionsValue,
  rows,
  rowValue,
  saveAsJpeg,
  saveAsPdf,
  saveAsPng,
  valuesPercentage,
} from '../handleElements/handleElements.js';

import { saveChartAsImage, saveChartAsPdf } from './handleDownloads.js';

export function handleCoinsFunctions() {
  // Get the value of the per_page to persist
  const storedValue = localStorage.getItem('per_page');
  if (storedValue) {
    rowValue.text(storedValue);
  }

  if (mainTableOfCoins) {
    // Create the chart for each coins
    coins.forEach((coin) => {
      const coinId = coin.getAttribute('data-href').split('/')[2];
      createChartForAllCoins(coinId);
    });
  }

  // Create the chart for unique coin
  coinName.forEach((coin) => {
    constCoinIdName = coin.getAttribute('data-coin');
    createUniqueChart(constCoinIdName);
  });

  //Handle the click for each coin to retrieve the info
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      window.location.href = row.dataset.href;
    });
  });

  // Change the color of percentage values based on the change
  valuesPercentage.each(function () {
    const text = $(this).text().replace('%', '').trim();
    const percentage = parseFloat(text);

    if (percentage < 0) {
      $(this).addClass('text-red-500');
      $(this).removeClass('text-green-500');
      $(this).prepend('<i class="fa-solid fa-caret-down mr-1"></i>');
    } else {
      $(this).addClass('text-green-500');
      $(this).removeClass('text-red-500');
      $(this).prepend('<i class="fa-solid fa-caret-up mr-1"></i>');
    }
  });

  // Handle the click on the data to be filtered in the chart
  daysInChart.forEach((button) => {
    button.addEventListener('click', () => {
      const days = button.getAttribute('data-days');

      coinName.forEach((coin) => {
        constCoinIdName = coin.getAttribute('data-coin');
        createUniqueChart(constCoinIdName, days);
      });
    });
  });

  // Handles the download of the chart
  if (saveAsPng) {
    saveAsPng.addEventListener('click', function () {
      const coinNameSelected = coinName[0].getAttribute('data-coin');

      saveChartAsImage('png', coinNameSelected);
    });
  }

  if (saveAsJpeg) {
    saveAsJpeg.addEventListener('click', function () {
      const coinNameSelected = coinName[0].getAttribute('data-coin');

      saveChartAsImage('jpeg', coinNameSelected);
    });
  }

  if (saveAsJpeg) {
    saveAsPdf.addEventListener('click', function () {
      const coinNameSelected = coinName[0].getAttribute('data-coin');

      saveChartAsPdf(coinNameSelected);
    });
  }

  // Handle the click on the dropdown menu and show the current number of rows
  coinsToShow.on('click', function (e) {
    e.preventDefault();
    dropDownQtdOptions.toggleClass('show');

    optionsValue.each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        const selectedValue = $(this).text();
        rowValue.text(selectedValue);

        // Store the selected value
        localStorage.setItem('per_page', selectedValue);

        const url = new URL(window.location.href);
        url.searchParams.set('per_page', selectedValue);
        window.location.href = url.href;
      });
    });
  });
}
