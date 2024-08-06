const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const formatCurrency = require("../utils/formatCurrency");
const formatDateWithRelativeTime = require("../utils/formatDate");

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

    const {
      id,
      symbol,
      name,
      description: { en: descriptionEn },
      links: {
        homepage,
        whitepaper,
        repos_url: { github },
      },
      image: { thumb, small, large },
      market_data: {
        current_price,
        market_cap,
        market_cap_rank,
        total_volume,
        high_24h,
        low_24h,
        price_change_24h,
        price_change_percentage_24,
        price_change_percentage_7d,
        price_change_percentage_14d,
        price_change_percentage_30d,
        price_change_percentage_60d,
        price_change_percentage_200d,
        price_change_percentage_1y,
        market_cap_change_24,
        market_cap_change_percentage_24h,
        price_change_24h_in_currency,
        price_change_percentage_1h_in_currency,
        price_change_percentage_24h_in_currency,
        price_change_percentage_7d_in_currency,
        price_change_percentage_14d_in_currency,
        price_change_percentage_30d_in_currency,
        price_change_percentage_60d_in_currency,
        price_change_percentage_200d_in_currency,
        price_change_percentage_1y_in_currency,
        market_cap_change_percentage_24h_in_currency,
        total_supply,
        max_supply,
        circulating_supply,
        last_updated,
        ath,
        ath_date,
        ath_change_percentage,
        atl,
        atl_date,
        atl_change_percentage,
      },
      tickers,
    } = coinData;

    const formattedCurrentPrice = {
      ...current_price,
      brl_formatted: formatCurrency(current_price.brl),
    };

    const formattedMarketCap = {
      ...market_cap,
      marketCap_formatted: formatCurrency(market_cap.brl),
    };

    const formattedTotalVolume = {
      ...total_volume,
      marketVolume_formatted: formatCurrency(total_volume.brl),
    };

    const formattedTotalSupply = {
      marketTotalSupply_formatted: formatCurrency(total_supply),
    };

    const formattedMaxSupply = {
      marketMaxSupply_formatted: formatCurrency(max_supply),
    };

    const formattedCirculatingSupply = {
      marketCirculatingSupply: formatCurrency(circulating_supply),
    };

    const totalPercentageOfCirculatingSupply =
      (circulating_supply / max_supply) * 100;

    const total = formatCurrency(totalPercentageOfCirculatingSupply);

    const lowPrice = {
      ...low_24h,
      formattedLowPrice: formatCurrency(low_24h.brl),
    };

    const highPrice = {
      ...high_24h,
      formattedHighPrice: formatCurrency(high_24h.brl),
    };

    const allTimeHighPrice = {
      ...ath,
      formattedAllTimeHighPrice: formatCurrency(ath.brl),
    };

    const allTimeLowPrice = {
      ...atl,
      formattedAllTimeLowPrice: formatCurrency(atl.brl),
    };

    const maxDateFormatted = {
      formattedAthDate: formatDateWithRelativeTime(ath_date.brl),
    };
    const lowDateFormatted = {
      formattedAtlDate: formatDateWithRelativeTime(atl_date.brl),
    };

    const result = {
      id,
      symbol,
      name,
      descriptionEn,
      homepage,
      whitepaper,
      github,
      thumb,
      small,
      large,
      current_price: formattedCurrentPrice,
      market_cap: formattedMarketCap,
      market_cap_rank,
      total_volume: formattedTotalVolume,
      high_24h: highPrice,
      low_24h: lowPrice,
      price_change_24h,
      price_change_percentage_24,
      price_change_percentage_7d,
      price_change_percentage_14d,
      price_change_percentage_30d,
      price_change_percentage_60d,
      price_change_percentage_200d,
      price_change_percentage_1y,
      market_cap_change_24,
      market_cap_change_percentage_24h,
      price_change_24h_in_currency,
      price_change_percentage_1h_in_currency,
      price_change_percentage_24h_in_currency,
      price_change_percentage_7d_in_currency,
      price_change_percentage_14d_in_currency,
      price_change_percentage_30d_in_currency,
      price_change_percentage_60d_in_currency,
      price_change_percentage_200d_in_currency,
      price_change_percentage_1y_in_currency,
      market_cap_change_percentage_24h_in_currency,
      total_supply: formattedTotalSupply,
      max_supply: formattedMaxSupply,
      circulating_supply: formattedCirculatingSupply,
      last_updated,
      ath: allTimeHighPrice,
      ath_date: maxDateFormatted,
      ath_change_percentage,
      atl: allTimeLowPrice,
      atl_date: lowDateFormatted,
      atl_change_percentage,
      total,
      tickers: tickers.map((ticker) => ({
        base: ticker.base,
        target: ticker.target,
        marketName: ticker.market.name,
        identifier: ticker.market.identifier,
        has_trading_incentive: ticker.market.has_trading_incentive,
        last: ticker.last,
        volume: ticker.volume,
        converted_last: ticker.converted_last,
        converted_volume: ticker.converted_volume,
        trust_score: ticker.trust_score,
        trade_url: ticker.trade_url,
      })),
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
