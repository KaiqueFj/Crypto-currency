const axios = require("axios");

// Fetch market data
exports.getMarketData = async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://api.coingecko.com/api/v3/coins/markets",
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: false,
      },
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.getSpecificCoin = async (req, res) => {
  const { coin, currency } = req.params; // Extract coin and currency from route parameters

  try {
    const response = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coin}`,

      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    // Extract specific fields from the response using destructuring
    const [coinData] = response.data; // Get the first element of the array
    if (!coinData) {
      return res.status(404).json({ error: "Coin not found" });
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

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to fetch data" });
  }
};
