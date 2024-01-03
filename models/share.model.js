module.exports = (sequelize, Sequelize) => {
    const Share = sequelize.define("share", {
        symbol: {
            type: Sequelize.STRING(3),
        },
    });

    return Share;
}