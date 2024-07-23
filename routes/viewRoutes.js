const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/overview", viewController.getOverview);
router.get("/coin/:coin/:currency", viewController.getSpecificCoin);

module.exports = router;
