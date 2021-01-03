const mysql = require('mysql2/promise');

const connect = async(username, password) => {
    
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: username,
            password: password,
            database: 'world' //!test
        });
        console.log('Successfully connected to database: world');
        global.connection = connection;
    } catch (error) {
        console.error('Database connection error: ' + error);
    };


    //!test
    /* 
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM country');
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
    */
    
}

module.exports = {connect};