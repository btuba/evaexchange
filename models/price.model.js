const { DATE } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Price = sequelize.define("price", {
        rate: {
            type: Sequelize.DECIMAL(10, 2)
        },
        createdAt: {
            type: DATE()
        }
    });

    return Price;
}