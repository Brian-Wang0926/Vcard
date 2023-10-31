const express = require("express");
const app = express();
const cardController = require("../controllers/card-controller");

app.get('/checkEligibility/:userId', cardController.checkEligibility);

app.get('/pairUsers', cardController.pairUsers);

module.exports = app;
