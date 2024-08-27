import {
  currencySelect,
  coinPriceElement,
  coinPriceUsd,
} from "./handleElements";

export function insertFlags() {
  const select = document.getElementById("currencySelect");
  const cryptoIcon = document.getElementById("cryptoIcon");
  const flagIcon = document.getElementById("flagIcon");

  // Map currency codes to icon URLs
  const iconMap = {
    btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    ltc: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
    bch: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png",
    bnb: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    eos: "https://cryptologos.cc/logos/eos-eos-logo.png",
    xrp: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
    xlm: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
    link: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    dot: "https://coin-images.coingecko.com/coins/images/12171/small/polkadot.png?1696512008",
    yfi: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png",
  };

  function updateIcon(currencyCode) {
    let iconUrl = "";
    if (currencyCode in iconMap) {
      iconUrl = iconMap[currencyCode];
      cryptoIcon.style.display = "inline-block";
      flagIcon.style.display = "none";
      cryptoIcon.innerHTML = `<img src="${iconUrl}" alt="${currencyCode}" style="width: 24px; height: 24px;">`;
    } else {
      const countryCode = currencyCode.slice(0, 2).toLowerCase();
      cryptoIcon.style.display = "none";
      flagIcon.style.display = "inline-block";
      flagIcon.className = `flag-icon flag-icon-${countryCode}`;
    }
  }

  // Initial setup
  if (select && select.value) {
    updateIcon(select.value);
  }

  // Update icon on change
  if (select) {
    select.addEventListener("change", () => {
      updateIcon(select.value);
    });
  }
}

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
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    }
  });
}
