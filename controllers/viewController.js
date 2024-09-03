const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const {
  convertUsdToCurrency,
  formatCurrency,
  formatDateWithRelativeTime,
  formatDescription,
} = require("../utils/formatting");

exports.getOverview = catchAsync(async (req, res, next) => {
  const itemsPerPage = req.query.per_page
    ? parseInt(req.query.per_page, 10)
    : 5;
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

    // Fetch trending data

    const fetchTrendingData = async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/search/trending",
        {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": process.env.API_KEY_Cry,
          },
        }
      );
      const trendingCoins = response.data.coins.map((coin) => {
        const { id, name, symbol, thumb, data } = coin.item;

        const priceChangePercentage24h = data.price_change_percentage_24h
          ? data.price_change_percentage_24h.brl
          : "N/A";

        return {
          id,
          name,
          symbol,
          thumb,
          priceChangePercentage24h, // Include the price change percentage
          data: {
            price: formatCurrency(data.price),
            marketCap: data.market_cap,
            totalVolume: data.total_volume,
            sparkline: data.sparkline,
          },
        };
      });

      return trendingCoins.slice(0, 3); // Get only the first 3 coins
    };

    // Fetch to get all the coins on the first page
    const coinsInPage = await axios({
      method: "GET",
      url: "https://api.coingecko.com/api/v3/coins/markets?price_change_percentage=1h%2C24h%2C7d&locale=pt&precision=2",
      params: {
        vs_currency: "brl",
        order: "market_cap_desc",
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
    const totalRows = itemsPerPage;
    const trendingData = await fetchTrendingData();

    // Render the overview template with the fetched coin data
    res.status(200).render("overview", {
      title: "Coins Overview",
      allCoin: allCoin,
      coinInPage: coinInPage,
      coins: coins,
      currentPage: currentPage,
      itemsPerPage: itemsPerPage,
      totalPages: totalPages,
      totalRows: totalRows,
      fetchTrendingData: trendingData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to fetch data",
    });
  }
});

const fetchCoinData = async (coin) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coin}`,
    {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    }
  );
  return response.data;
};

const fetchCoinTickers = async (coin) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coin}/tickers?include_exchange_logo=true&depth=true&order=volume_desc`,
    {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    }
  );
  return response.data.tickers;
};

const fetchSupportedCurrencies = async () => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/simple/supported_vs_currencies",
    {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    }
  );
  return response.data.sort();
};

const fetchExchangeRate = async () => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=brl`,
    {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    }
  );
  return response.data.usd.brl;
};

const paginateTickers = (tickers, perPage, currentPage) => {
  const totalItems = tickers.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedTickers = tickers.slice(startIndex, startIndex + perPage);

  return {
    paginatedTickers,
    totalPages,
    totalItems,
    currentPage,
    itemsPerPage: perPage,
  };
};

exports.getSpecificCoin = catchAsync(async (req, res, next) => {
  const { coin } = req.params;
  const itemsPerPage = parseInt(req.query.per_page, 10) || 10;
  const currentPage = parseInt(req.query.page, 10) || 1;

  try {
    const [coinData, coinTicker, currencies, exchangeRate] = await Promise.all([
      fetchCoinData(coin),
      fetchCoinTickers(coin),
      fetchSupportedCurrencies(),
      fetchExchangeRate(),
    ]);

    if (!coinData) {
      return res.status(404).render("error", {
        title: "Coin Not Found",
        message: "The requested coin data could not be found.",
      });
    }

    const paginatedTickersData = paginateTickers(
      coinTicker,
      itemsPerPage,
      currentPage
    );

    const totalPercentageOfCirculatingSupply =
      (coinData.market_data.circulating_supply /
        coinData.market_data.max_supply) *
      100;

    const coinDataInfo = {
      id: coinData.id,
      symbol: coinData.symbol,
      name: coinData.name,
      sentiment_votes_up_percentage: coinData.sentiment_votes_up_percentage,
      sentiment_votes_down_percentage: coinData.sentiment_votes_down_percentage,
      descriptionEn: formatDescription(coinData.description.en),
      homepage: coinData.links.homepage,
      whitepaper: coinData.links.whitepaper,
      github: coinData.links.repos_url.github,
      thumb: coinData.image.thumb,
      small: coinData.image.small,
      large: coinData.image.large,
      current_price_usd: coinData.market_data.current_price.usd,
      current_price: formatCurrency(coinData.market_data.current_price.brl),
      market_cap: formatCurrency(coinData.market_data.market_cap.brl),
      market_cap_rank: coinData.market_data.market_cap_rank,
      total_volume: formatCurrency(coinData.market_data.total_volume.brl),
      high_24h: formatCurrency(coinData.market_data.high_24h.brl),
      low_24h: formatCurrency(coinData.market_data.low_24h.brl),
      price_change_24h: coinData.market_data.price_change_24h.brl,
      price_change_percentage_24:
        coinData.market_data.price_change_percentage_24h,
      price_change_percentage_24h_in_currency:
        coinData.market_data.price_change_percentage_24h_in_currency.brl,
      market_cap_change_percentage_24h_in_currency:
        coinData.market_data.market_cap_change_percentage_24h_in_currency.brl,
      total_supply: formatCurrency(coinData.market_data.total_supply),
      max_supply: formatCurrency(coinData.market_data.max_supply),
      circulating_supply: formatCurrency(
        coinData.market_data.circulating_supply
      ),
      ath: formatCurrency(coinData.market_data.ath.brl),
      ath_date: formatDateWithRelativeTime(coinData.market_data.ath_date.brl),
      ath_change_percentage: coinData.market_data.ath_change_percentage.brl,
      atl: formatCurrency(coinData.market_data.atl.brl),
      atl_date: formatDateWithRelativeTime(coinData.market_data.atl_date.brl),
      atl_change_percentage: coinData.market_data.atl_change_percentage.brl,
      total: formatCurrency(totalPercentageOfCirculatingSupply),
    };

    const formattedTickers = paginatedTickersData.paginatedTickers.map(
      (ticker) => ({
        base: ticker.base,
        target: ticker.target,
        marketName: ticker.market.name,
        marketIdentifier: ticker.market.identifier,
        hasTradingIncentive: ticker.market.has_trading_incentive,
        logo: ticker.market.logo,
        lastPrice: formatCurrency(
          convertUsdToCurrency(ticker.last, exchangeRate)
        ),
        volume: formatCurrency(ticker.volume),
        trustScore: ticker.trust_score,
        cost_to_move_up_usd: formatCurrency(
          convertUsdToCurrency(ticker.cost_to_move_up_usd, exchangeRate)
        ),
        cost_to_move_down_usd: formatCurrency(
          convertUsdToCurrency(ticker.cost_to_move_down_usd, exchangeRate)
        ),
        bidAskSpreadPercentage: ticker.bid_ask_spread_percentage,
        tradeUrl: ticker.trade_url,
        lastTradedAt: ticker.last_traded_at,
        lastFetchAt: formatDateWithRelativeTime(ticker.last_fetch_at),
        convertedLast: ticker.converted_last,
        convertedVolume: ticker.converted_volume,
      })
    );

    res.status(200).render("coin", {
      title: `Overview of ${coinData.name}`,
      coin: coinDataInfo,
      coinTickerData: formattedTickers,
      coinName: coinDataInfo.id,
      currentPage: paginatedTickersData.currentPage,
      totalPages: paginatedTickersData.totalPages,
      totalItems: paginatedTickersData.totalItems,
      itemsPerPage: paginatedTickersData.itemsPerPage,
      currencies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to fetch data",
    });
  }
});

const fetchFearGreedIndex = async () => {
  const response = await axios.get(`https://api.alternative.me/fng/?limit=7`, {
    headers: {
      accept: "application/json",
    },
  });

  return response.data.data.map((item) => ({
    value: item.value,
    classification: item.value_classification,
    timestamp: item.timestamp,
  }));
};

exports.getFearGreedIndex = catchAsync(async (req, res, next) => {
  try {
    const fearGreedData = await fetchFearGreedIndex();
    res.status(200).render("fearGreed", {
      title: `Overview of Fear Greed`,
      fearGreedValue: fearGreedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to fetch data",
    });
  }
});
