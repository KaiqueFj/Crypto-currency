const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  try {
    // Fetch data from CoinGecko API
    const response = await axios({
      method: "GET",
      url: "https://api.coingecko.com/api/v3/coins/markets",
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        page: 1,
        sparkline: false,
      },
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    const coins = response.data;

    // Render the overview template with the fetched coin data
    res.status(200).render("overview", {
      title: "Coins Overview",
      coins: coins,
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

    console.log(coinData);

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
