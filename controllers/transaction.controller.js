const { Client } = require("pg");
const db = require("../models");
const { where } = require("sequelize");
const Transaction = db.transactions;
const Share = db.shares;
const Portfolio = db.portfolios;
const client = db.clients;
const Prices = db.prices;

exports.buy = async (req, res) => {

    if(!req.body.shareId || !req.body.quantity  || !req.body.clientId) {
        res.status(400).send({ message: "Content can not be empty" });
        return;
    }

    if(req.body.quantity <= 0) {
        res.status(400).send({ message: "Quantity must be positive number" });
        return;
    }

    try {
        let shareData = await Share.findByPk(req.body.shareId);

        if(shareData == null) {
            res.status(500).send({ message: "Share could not be found." });
            return;
        }

        let clientData = await client.findByPk(req.body.clientId);

        if(clientData == null) {
            res.status(500).send({ message: "Customer could not be found." });
            return;
        }

        let portfolioData = await Portfolio.findOne({
            where: {
                clientId: req.body.clientId
            }
        });

        if(portfolioData == null){
            res.status(400).send({ message: "Customer's portfolio could not be found." });
            return;
        }

        let priceData = await Prices.findOne({
            where: {
                shareId: req.body.shareId
            },
            order: [ [ 'createdAt', 'DESC' ]],
        });
        
        if(priceData == null) {
            res.status(400).send({ message: "Share's price could not be found." });
            return;
        }

        const transaction = {
            portfolioId: portfolioData.dataValues.id,
            shareId: req.body.shareId,
            quantity: req.body.quantity,
            action: "BUY",
            rate: priceData.rate
        }

        await Transaction.create(transaction);
        res.status(200).send({
            portfolioId: portfolioData.dataValues.id,
            share: shareData,
            action: "BUY",
            quantity: req.body.quantity,
            rate: priceData.rate
        });

    } catch(err) {
        res.status(500).send({ message: err.message || "Error while creating" })
    }
};

exports.sell = async (req, res) => {
    if(!req.body.shareId || !req.body.quantity || !req.body.clientId) {
        res.status(400).send({ message: "Content can not be empty" });
        return;
    }

    if(req.body.quantity <= 0) {
        res.status(400).send({ message: "Quantity must be positive number" });
        return;
    }

    try {
        let shareData = await Share.findByPk(req.body.shareId);

        if(!shareData) {
            res.status(500).send({ message: "Share could not be found." });
            return;
        }

        let clientData = await client.findByPk(req.body.clientId);

        if(!clientData) {
            res.status(500).send({ message: "Customer could not be found." });
            return;
        }

        const portfolioData = await Portfolio.findOne({
            where: {
                clientId: req.body.clientId
            }
        });

        if(portfolioData == null){
            res.status(400).send({ message: "Customer's portfolio could not be found." });
            return;
        }

        let priceData = await Prices.findOne({
            where: {
                shareId: req.body.shareId
            },
            order: [ [ 'createdAt', 'DESC' ]],
        });
        
        if(priceData == null) {
            res.status(500).send({ message: "Share's price could not be found." });
            return;
        }

        let buySum = await Transaction.sum("quantity", {
            where: {
                action: "BUY",
                portfolioId: portfolioData.dataValues.id,
                shareId: req.body.shareId
            }
        });
        let sellSum = await Transaction.sum("quantity", {
            where: {
                action: "SELL",
                portfolioId: portfolioData.dataValues.id,
                shareId: req.body.shareId
            }
        });
        buySum = (isNaN(buySum) ? 0 : buySum);
        sellSum = (isNaN(sellSum) ? 0 : sellSum);
        
        let sum = buySum - sellSum - req.body.quantity;
        if(sum < 0) {
            res.status(400).send({ message: "Customer does not have enough shares to sell" });
            return; 
        }

        const transaction = {
            portfolioId: portfolioData.dataValues.id,
            shareId: req.body.shareId,
            quantity: req.body.quantity,
            action: "SELL",
            rate: priceData.dataValues.rate
        }
        await Transaction.create(transaction);

        res.send({
            clientId: req.body.clientId,
            share: shareData,
            action: "SELL",
            quantity: req.body.quantity,
            rate: priceData.dataValues.rate,
        });
    } catch(err) {
        res.status(500).send({ message: err.message || "Error while creating" });
    }

};