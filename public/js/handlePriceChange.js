import {
  currencySelect,
  coinPriceElement,
  selectedCurrencyElement,
  coinPriceUsd,
} from "./handleElements";

export function handleCoinValueInCurrency() {
  currencySelect.addEventListener("change", async () => {
    const selectedCurrency = currencySelect.value.toLowerCase();

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=${selectedCurrency}`
      );
      const data = await response.json();

      const conversionRate = data.usd[selectedCurrency];

      // Calculate the new price by multiplying the coin's price in USD by the conversion rate
      const newPrice = coinPriceUsd * conversionRate;

      // Update the price and currency symbol in the DOM
      coinPriceElement.textContent = `${newPrice.toLocaleString()} ${selectedCurrency.toUpperCase()}`;
      selectedCurrencyElement.textContent = selectedCurrency.toUpperCase();
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    }
  });
}
