const {Client} = require('pg');

const connect = async() => {
   const pgconnection = new Client({

    //*Template
       user: 'test',
       password: 'test',
       host: 'localhost',
       database: 'test'
       
   });

   try {
       await pgconnection.connect();
       console.log('Successfully connected to PostgreSQL db');
       global.pgconnection = pgconnection;
   } catch (error) {
       console.log(error);
   }
    
}

module.exports = {connect};