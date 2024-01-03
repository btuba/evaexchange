module.exports = app => {
    const transactions = require("../controllers/transaction.controller");

    let router = require("express").Router();
    router.post("/buy", transactions.buy);
    router.post("/sell", transactions.sell);

    app.use("/api/transaction", router);
};