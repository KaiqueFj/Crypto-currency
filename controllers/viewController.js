const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const formatCurrency = require("../utils/formatCurrency");
const formatDateWithRelativeTime = require("../utils/formatDate");
const formatDescription = require("../utils/formatText");
const convertUsdToBrl = require("../utils/convertToCurrency");

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

  // Get pagination parameters from query
  const itemsPerPage = req.query.per_page
    ? parseInt(req.query.per_page, 10)
    : 10; // Default to 10 items per page if not provided
  const currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;

  try {
    const response = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/${coin}`,
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    const coinData = response.data;
    if (!coinData) {
      return res.status(404).render("error", {
        title: "Coin Not Found",
        message: "The requested coin data could not be found.",
      });
    }

    const getTicker = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/${coin}/tickers?include_exchange_logo=true&depth=true&order=volume_desc`,
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });

    const coinTicker = getTicker.data.tickers;

    const getValueToCurrentCurrency = await axios({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=brl`,
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.API_KEY_Cry,
      },
    });
    const rate = getValueToCurrentCurrency.data.usd.brl;

    const totalPercentageOfCirculatingSupply =
      (coinData.market_data.circulating_supply /
        coinData.market_data.max_supply) *
      100;

    // Process the data about the selected coin
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

    // Paginate the tickers
    const paginateTickers = (tickers, perPage, currentPage) => {
      const totalItems = tickers.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const itemsPerPage = perPage;

      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedTickers = tickers.slice(startIndex, endIndex);

      return {
        paginatedTickers,
        totalPages,
        totalItems,
        currentPage,
        itemsPerPage,
      };
    };

    const paginatedTickersData = paginateTickers(
      coinTicker,
      itemsPerPage,
      currentPage
    );

    // Process the tickers array
    const formattedTickers = paginatedTickersData.paginatedTickers.map(
      (ticker) => ({
        base: ticker.base,
        target: ticker.target,
        marketName: ticker.market.name,
        marketIdentifier: ticker.market.identifier,
        hasTradingIncentive: ticker.market.has_trading_incentive,
        logo: ticker.market.logo,
        lastPrice: formatCurrency(convertUsdToBrl(ticker.last, rate)),
        volume: formatCurrency(ticker.volume),
        trustScore: ticker.trust_score,

        cost_to_move_up_usd: formatCurrency(
          convertUsdToBrl(ticker.cost_to_move_up_usd, rate)
        ),
        cost_to_move_down_usd: formatCurrency(
          convertUsdToBrl(ticker.cost_to_move_down_usd, rate)
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to fetch data",
    });
  }
});
