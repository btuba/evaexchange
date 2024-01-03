const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync({ force: true })
    .then(() => {
        db.shares.bulkCreate([
            { symbol: "AAA"},
            { symbol: "BBB"},
            { symbol: "CCC"},
        ]).then(() => console.log("shares bulk creation combleted"));
    })
    .then(() => {
        db.prices.bulkCreate([
            { shareId: 1, rate: 10.02 },
            { shareId: 2, rate: 11.05 },
            { shareId: 3, rate: 15.09 },
        ]).then(() => console.log("prices bulk creation combleted"));
    })
    .then(() => {
        db.clients.bulkCreate([
            {}, {}, {}, {}, {}
        ]).then(() => console.log("clients bulk creation combleted"));
    })
    .then(() => {
        db.portfolios.bulkCreate([
            { clientId: 1 }, { clientId: 2 }, { clientId: 3 }, { clientId: 4 }
        ]).then(() => console.log("portfolios bulk creation combleted"));
    })
    .then(() => {
        db.transactions.bulkCreate([
            { portfolioId: 1, shareId: 1, action: "BUY", quantity: 10, rate: 12.00 },
            { portfolioId: 1, shareId: 2, action: "SELL", quantity: 3, rate: 10.00 },
            { portfolioId: 2, shareId: 2, action: "BUY", quantity: 20, rate: 10.00 },
            { portfolioId: 2, shareId: 3, action: "SELL", quantity: 10, rate: 15.0 },
            { portfolioId: 3, shareId: 1, action: "BUY", quantity: 10, rate: 5.00 },
            { portfolioId: 3, shareId: 3, action: "SELL", quantity: 10, rate: 1.00 },
            { portfolioId: 4, shareId: 1, action: "BUY", quantity: 10, rate: 10.00 },
            { portfolioId: 4, shareId: 3, action: "SELL", quantity: 5, rate: 12.03 }
        ]).then(() => console.log("transaction bulk creation combleted"));
    });

require("./routers/transaction.router")(app);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});