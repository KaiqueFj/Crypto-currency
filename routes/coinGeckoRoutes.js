const express = require("express");
const coinGeckoController = require("../controllers/coinGeckoController");

const router = express.Router();

router.get("/marketData", coinGeckoController.getMarketData);
router.get(
  "/getCryptoCoin/:coin/:currency",
  coinGeckoController.getSpecificCoin
);

module.exports = router;
