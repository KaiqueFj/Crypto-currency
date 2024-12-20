const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const {
  convertUsdToCurrency,
  formatCurrency,
  formatDateWithRelativeTime,
  formatDescription,
  formatLargeNumber,
  formatTimesTamp,
} = require('../utils/formatting');
const Portfolio = require('../models/portfolioModel');
const AppError = require('../utils/AppError');

// Helper function to make API requests
const fetchData = async (url, headers = {}, params = {}) => {
  try {
    const response = await axios.get(url, { headers, params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw new Error('Failed to fetch data');
  }
};

// Fetch global market cap and volume data
const fetchGlobalCapVolume = async () => {
  const data = await fetchData('https://api.coingecko.com/api/v3/global', {
    accept: 'application/json',
    'x-cg-demo-api-key': process.env.API_KEY_Cry,
  });

  const globalData = data.data;

  return {
    totalMarketCap: formatLargeNumber(globalData.total_market_cap.usd),
    totalVolume: formatLargeNumber(globalData.total_volume.usd),
    marketDominanceBtc: globalData.market_cap_percentage.btc,
    marketCapChangePercent: globalData.market_cap_change_percentage_24h_usd,
  };
};

// Fetch trending data
const fetchTrendingData = async () => {
  const data = await fetchData(
    'https://api.coingecko.com/api/v3/search/trending',
    { accept: 'application/json', 'x-cg-demo-api-key': process.env.API_KEY_Cry }
  );

  return data.coins.slice(0, 3).map((coin) => {
    const { id, name, symbol, thumb, data } = coin.item;
    const priceChangePercentage24h = data.price_change_percentage_24h
      ? data.price_change_percentage_24h.usd
      : 'N/A';

    return {
      id,
      name,
      symbol,
      thumb,
      priceChangePercentage24h,
      data: {
        price: formatCurrency(data.price),
        marketCap: data.market_cap,
        totalVolume: data.total_volume,
        sparkline: data.sparkline,
      },
    };
  });
};

// Fetch Fear & Greed Index data
const fetchFearGreedIndex = async () => {
  const data = await fetchData('https://api.alternative.me/fng/?limit=7');

  return data.data.map((item) => ({
    value: item.value,
    classification: item.value_classification,
    timestamp: formatTimesTamp(item.timestamp),
  }));
};

// signUp page
exports.getSignUpPageUser = (req, res) => {
  res.status(200).render('signUp', {
    title: 'Your account',
  });
};

// signIn page
exports.getSignInPageUser = (req, res) => {
  res.status(200).render('signIn', {
    title: 'Your account',
  });
};

// Profile
exports.getProfilePageUser = (req, res) => {
  res.status(200).render('profile', {
    title: 'Your account',
  });
};

// Portfolio
exports.getPortfolioPageUser = async (req, res, next) => {
  // 1 - get the portfolio data
  const portfolio = await Portfolio.findOne({ user: req.params.id });

  // 2 - check if there's the portfolio
  if (!portfolio) {
    return next(new AppError('There is no portfolio with that user', 404));
  }

  const portfolioData = portfolio.coins;

  // 3 - Check if the portfolio has any coins
  if (!portfolioData || portfolioData.length === 0) {
    // Render the page with no coins
    return res.status(200).render('portfolio', {
      coins: [],
      portfolioInfo: portfolioData, // Empty in this case
    });
  }

  // 4 - Get the coin names from the portfolio
  const coinNames = portfolio.coins
    .map((coin) => coin.coinName.toLowerCase())
    .join(',');

  // 5 - fetch the coins from the API only if there are coin names
  try {
    const coinsToRetrieveFromApi = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?ids=${coinNames}&vs_currency=usd`,
      {
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.API_KEY_Cry,
        },
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          sparkline: false,
          price_change_percentage: '1h,24h,7d',
        },
      }
    );

    const apiCoins = coinsToRetrieveFromApi.data;

    // 6 - Map API coins to portfolio coins
    const coinsWithPortfolioIds = apiCoins.map((apiCoin) => {
      const matchedCoin = portfolioData.find(
        (portfolioCoin) =>
          portfolioCoin.coinName.toLowerCase() === apiCoin.name.toLowerCase()
      );
      return {
        ...apiCoin,
        portfolioId: matchedCoin ? matchedCoin._id.toString() : null, // Attach portfolio ID if matched
      };
    });

    // 7 - Render the page with the updated data
    res.status(200).render('portfolio', {
      coins: coinsWithPortfolioIds,
      portfolioInfo: portfolioData,
    });
  } catch (err) {
    console.error('Error fetching coins from API:', err);
    return next(new AppError('Failed to fetch coins from API', 500));
  }
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const itemsPerPage = parseInt(req.query.per_page, 10) || 5;
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Check if user is logged in
  const userId = res.locals.user ? res.locals.user._id.toString() : null;

  let coinNames = null;
  let coinsIds = null;

  // Only fetch or create portfolio data if the user is logged in
  if (userId) {
    try {
      let portfolio = await Portfolio.findOne({ user: userId });

      // If no portfolio exists, create an empty one
      if (!portfolio) {
        portfolio = await Portfolio.create({ user: userId, coins: [] });
      }

      // Extract coin names and coin IDs from the portfolio
      coinNames = portfolio.coins
        .map((coin) => coin.coinName.split(','))
        .join(',');
      coinsIds = portfolio.coins.map((coin) =>
        coin._id.toString().split(',').join(',')
      );
    } catch (err) {
      console.error(err);
      return next(
        new AppError('Failed to fetch or create portfolio data', 500)
      );
    }
  }

  // Fetch market data and other API information
  try {
    const [
      allCoins,
      coinsInPage,
      cryptoCoins,
      trendingData,
      globalDataVolCap,
      fearGreedData,
    ] = await Promise.all([
      fetchData('https://api.coingecko.com/api/v3/coins/list', {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.API_KEY_Cry,
      }),
      fetchData(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.API_KEY_Cry,
        },
        { vs_currency: 'usd', order: 'market_cap_desc', sparkline: false }
      ),
      fetchData(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.API_KEY_Cry,
        },
        {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          page: currentPage,
          per_page: itemsPerPage,
          sparkline: false,
          price_change_percentage: '1h,24h,7d',
        }
      ),
      fetchTrendingData(),
      fetchGlobalCapVolume(),
      fetchFearGreedIndex(),
    ]);

    const totalCoins = allCoins.length;
    const totalPages = Math.ceil(totalCoins / itemsPerPage);

    // Render the overview page
    res.status(200).render('overview', {
      title: 'Coins Overview',
      allCoin: allCoins,
      coinInPage: coinsInPage,
      coins: cryptoCoins,
      currentPage,
      itemsPerPage,
      totalPages,
      totalRows: itemsPerPage,
      fetchTrendingData: trendingData,
      globalData: globalDataVolCap,
      fearGreedValue: fearGreedData,
      coinsFromPortFolio: coinNames,
      coinsIdFromPortFolio: coinsIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch data',
    });
  }
});

// API calls related to the specific coin page
const fetchCoinData = async (coin) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coin}`,
    {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.API_KEY_Cry,
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
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.API_KEY_Cry,
      },
    }
  );
  return response.data.tickers;
};

const fetchSupportedCurrencies = async () => {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/simple/supported_vs_currencies',
    {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.API_KEY_Cry,
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
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.API_KEY_Cry,
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
  const itemsPerPage = parseInt(req.query.per_page, 5) || 5;
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Check if user is logged in
  const userId = res.locals.user ? res.locals.user._id.toString() : null;

  let coinNames = null;
  let coinsIds = null;

  // Only fetch or create portfolio data if the user is logged in
  if (userId) {
    try {
      let portfolio = await Portfolio.findOne({ user: userId });

      // If no portfolio exists, create an empty one
      if (!portfolio) {
        portfolio = await Portfolio.create({ user: userId, coins: [] });
      }

      // Extract coin names and coin IDs from the portfolio
      coinNames = portfolio.coins
        .map((coin) => coin.coinName.split(','))
        .join(',');
      coinsIds = portfolio.coins.map((coin) =>
        coin._id.toString().split(',').join(',')
      );
    } catch (err) {
      console.error(err);
      return next(
        new AppError('Failed to fetch or create portfolio data', 500)
      );
    }
  }

  try {
    const [coinData, coinTicker, currencies, exchangeRate] = await Promise.all([
      fetchCoinData(coin),
      fetchCoinTickers(coin),
      fetchSupportedCurrencies(),
      fetchExchangeRate(),
    ]);

    if (!coinData) {
      return res.status(404).render('error', {
        title: 'Coin Not Found',
        message: 'The requested coin data could not be found.',
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
      current_price: formatCurrency(coinData.market_data.current_price.usd),
      market_cap: formatCurrency(coinData.market_data.market_cap.usd),
      market_cap_rank: coinData.market_data.market_cap_rank,
      total_volume: formatCurrency(coinData.market_data.total_volume.usd),
      high_24h: formatCurrency(coinData.market_data.high_24h.usd),
      low_24h: formatCurrency(coinData.market_data.low_24h.usd),
      price_change_24h: coinData.market_data.price_change_24h.usd,
      price_change_percentage_24:
        coinData.market_data.price_change_percentage_24h,
      price_change_percentage_24h_in_currency:
        coinData.market_data.price_change_percentage_24h_in_currency.usd,
      market_cap_change_percentage_24h_in_currency:
        coinData.market_data.market_cap_change_percentage_24h_in_currency.usd,
      total_supply: formatCurrency(coinData.market_data.total_supply),
      max_supply: formatCurrency(coinData.market_data.max_supply),
      circulating_supply: formatCurrency(
        coinData.market_data.circulating_supply
      ),
      ath: formatCurrency(coinData.market_data.ath.usd),
      ath_date: formatDateWithRelativeTime(coinData.market_data.ath_date.usd),
      ath_change_percentage: coinData.market_data.ath_change_percentage.usd,
      atl: formatCurrency(coinData.market_data.atl.usd),
      atl_date: formatDateWithRelativeTime(coinData.market_data.atl_date.usd),
      atl_change_percentage: coinData.market_data.atl_change_percentage.usd,
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

    res.status(200).render('coin', {
      title: `Overview of ${coinData.name}`,
      coin: coinDataInfo,
      coinTickerData: formattedTickers,
      coinName: coinDataInfo.id,
      currentPage: paginatedTickersData.currentPage,
      totalPages: paginatedTickersData.totalPages,
      totalItems: paginatedTickersData.totalItems,
      itemsPerPage: paginatedTickersData.itemsPerPage,
      currencies,
      coinsFromPortFolio: coinNames,
      coinsIdFromPortFolio: coinsIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch data',
    });
  }
});

exports.getFearGreedIndex = catchAsync(async (req, res, next) => {
  try {
    const fearGreedData = await fetchFearGreedIndex();
    res.status(200).render('fearGreed', {
      title: `Overview of Fear Greed`,
      fearGreedValue: fearGreedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch data',
    });
  }
});

exports.getTrendingCoinsPage = catchAsync(async (req, res, next) => {
  // Fetch trending data
  const fetchTrendingData = async () => {
    const data = await fetchData(
      'https://api.coingecko.com/api/v3/search/trending',
      {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.API_KEY_Cry,
      }
    );

    // Map the data to extract necessary fields
    return data.coins.map(({ item }) => {
      const {
        id,
        name,
        symbol,
        thumb,
        market_cap_rank,
        price_btc,
        data: {
          price,
          market_cap,
          total_volume,
          price_change_percentage_24h = {},
          sparkline,
        } = {},
      } = item;

      return {
        id,
        name,
        symbol,
        thumb,
        market_cap_rank,
        price_btc,
        price: price || 'N/A',
        market_cap: market_cap || 'N/A',
        total_volume: total_volume || 'N/A',
        price_change_percentage_24h_usd:
          price_change_percentage_24h?.usd || 'N/A',
        price_change_percentage_24h_usd:
          price_change_percentage_24h?.usd || 'N/A',
        sparkline,
      };
    });
  };

  try {
    const trendingCoins = await fetchTrendingData();
    const topCoins = trendingCoins.slice(0, 3);

    res.status(200).render('trending-crypto', {
      title: `Overview of all News`,
      coins: trendingCoins,
      topCoins: topCoins,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch data',
    });
  }
});

exports.getPortfolioPage = catchAsync(async (req, res, next) => {
  res.status(200).render('portfolio', {
    title: 'Your Portfolio',
  });
});
