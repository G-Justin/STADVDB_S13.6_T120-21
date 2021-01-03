//TODO: connect to mysql
const {Sequelize} = require('sequelize');

const connectToDatabase = async(dbname, username, password) => {
    const sequelize = new Sequelize(dbname, username, password, {
        host: 'localhost',
        dialect: 'mysql'
    });

    try {
        await sequelize.authenticate();
        console.log('Success.');
    } catch (error) {
        console.error('Unable to connect: ' + error);
    }
}

module.exports = {
    connectToDatabase
};