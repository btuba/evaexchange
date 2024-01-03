module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        action: {
            type: Sequelize.STRING(4)
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        rate: {
            type: Sequelize.DECIMAL(10, 2)
        }
    });

    return Transaction;
};