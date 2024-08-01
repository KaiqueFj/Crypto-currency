import { createChart } from "./chart.js";
import {
  coins,
  coinsToShow,
  dropDownQtdOptions,
  optionsValue,
  rows,
  rowValue,
  valuesPercentage,
} from "./handleElements.js";

export function handleCoinsFunctions() {
  // Get the value of the per_page to persist
  const storedValue = localStorage.getItem("per_page");
  if (storedValue) {
    rowValue.text(storedValue);
  }

  // Create the chart for each coins
  coins.forEach((coin) => {
    const coinId = coin.getAttribute("data-href").split("/")[2];
    createChart(coinId);
  });

  //Handle the click for each coin to retrieve the info
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = row.dataset.href;
    });
  });

  // Change the color of percentage values based on the change
  valuesPercentage.each(function () {
    const text = $(this).text().replace("%", "").trim();
    const percentage = parseFloat(text);

    if (percentage < 0) {
      $(this).addClass("text-red-500");
      $(this).removeClass("text-green-500");
      $(this).prepend('<i class="fa-solid fa-caret-down mr-1"></i>');
    } else {
      $(this).addClass("text-green-500");
      $(this).removeClass("text-red-500");
      $(this).prepend('<i class="fa-solid fa-caret-up mr-1"></i>');
    }
  });

  // Handle the click on the dropdown menu and show the current number of rows
  coinsToShow.on("click", function (e) {
    e.preventDefault();
    dropDownQtdOptions.toggleClass("show");

    optionsValue.each(function () {
      $(this).on("click", function (e) {
        e.preventDefault();
        const selectedValue = $(this).text();
        rowValue.text(selectedValue);

        // Store the selected value
        localStorage.setItem("per_page", selectedValue);

        const url = new URL(window.location.href);
        url.searchParams.set("per_page", selectedValue);
        window.location.href = url.href;
      });
    });
  });
}
