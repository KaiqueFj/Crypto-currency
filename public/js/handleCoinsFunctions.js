import { createChart } from "./chart.js";
import {
  coins,
  coinsToShow,
  dropDownQtdOptions,
  optionsValue,
  rows,
  rowValue,
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
