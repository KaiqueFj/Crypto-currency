const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  const itemsPerPage = 20;
  const currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;

  try {
    // Fetch to get all the coins available
    const allCoins = await axios({
      method: "GET",
      url: "https://api.coingecko.com/api/v3/coins/list",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    // Fetch to get all the coins on the first page
    const coinsInPage = await axios({
      method: "GET",
      url: "https://api.coingecko.com/api/v3/coins/markets?price_change_percentage=1h%2C24h%2C7d&locale=pt&precision=2",

      params: {
        vs_currency: "brl",
        order: "market_cap_desc",
        per_page: 20,

        sparkline: false,
      },
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    // Fetch to get the first 20 coins
    const cryptoCoins = await axios({
      method: "GET",
      url: "https://api.coingecko.com/api/v3/coins/markets?price_change_percentage=1h%2C24h%2C7d&locale=pt&precision=2",
      params: {
        vs_currency: "brl",
        order: "market_cap_desc",
        page: currentPage,
        per_page: itemsPerPage,
        sparkline: false,
      },
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    const allCoin = allCoins.data;
    const coinInPage = coinsInPage.data;
    const coins = cryptoCoins.data;
    const totalCoins = allCoin.length;
    const totalPages = Math.ceil(totalCoins / itemsPerPage);

    // Render the overview template with the fetched coin data
    res.status(200).render("overview", {
      title: "Coins Overview",
      allCoin: allCoin,
      coinInPage: coinInPage,
      coins: coins,
      currentPage: currentPage,
      itemsPerPage: itemsPerPage,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to fetch data",
    });
  }
});

exports.getSpecificCoin = catchAsync(async (req, res, next) => {
  const { coin, currency } = req.params;

  try {
    const response = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coin}`,
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    const [coinData] = response.data;
    if (!coinData) {
      return res.status(404).render("error", {
        title: "Coin Not Found",
        message: "The requested coin data could not be found.",
      });
    }

    const {
      id,
      symbol,
      name,
      current_price,
      image,
      market_cap,
      total_volume,
      high_24h,
      low_24h,
    } = coinData;

    const result = {
      id,
      symbol,
      name,
      current_price,
      image,
      market_cap,
      total_volume,
      high_24h,
      low_24h,
    };

    res.status(200).render("coin", {
      title: `Overview of ${name}`,
      coin: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to fetch data",
    });
  }
});
