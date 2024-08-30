export const dropDownQtdOptions = $(".dropdownOptions");
export const optionsValue = $(".option");
export const coinsToShow = $(".coinsToShow");
export const rowValue = $(".rowValue");
export const coins = document.querySelectorAll("[data-href]");
export const rows = document.querySelectorAll("tr[data-href]");
export const valuesPercentage = $(".changeValue");
export const tableHeaders = document.querySelectorAll("th[data-sort]");
export const iconsSpan = document.querySelectorAll(".icon");
export const iconsInfo = $(".information");
export const marketCapInfo = $(".coinMessage");
export const coinName = document.querySelectorAll("[data-coin]");
export const daysInChart = document.querySelectorAll(".optionChartDays");
export const saveAsPng = document.querySelector(".saveAsPng");
export const saveAsJpeg = document.querySelector(".saveAsJpeg");
export const saveAsPdf = document.querySelector(".saveAsPdf");
export const saveAsButtonDropdown = $(".saveAsBtnDropdown");
export const optionsContainerDownloads = $(".downloadsDropDownOptions ");
export const sentimentProfitBarUp = document.querySelector(".sentimentUp");
export const profitBar = document.querySelector(".profit-bar");
export const sentimentProfitBarDown = document.querySelector(".sentimentDown");
export const lostBar = document.querySelector(".lost-bar");
export const greed = document.querySelector(".fear-greed-indicator");
export const navItems = document.querySelectorAll(
  ".asideNavigation [data-target]"
);

// Fear & Greed
export const feedGreedCoinContainer = document.querySelector(".fearGreedCoin");
const fearGreedElement = document.querySelector(".fear-greed-value");
export const fearGreedValue = fearGreedElement
  ? fearGreedElement.dataset.value
  : null;

export const needle = document.querySelector(".speedometer-needle");

//  Handle of price change based on currency
export const coinPriceValue = document.getElementById("coinPriceValue");
export const coinQuantity = document.getElementById("coinQuantity");
export const currencySelect = document.getElementById("currencySelect");

export const select = document.getElementById("currencySelect");
export const cryptoIcon = document.getElementById("cryptoIcon");
export const flagIcon = document.getElementById("flagIcon");
