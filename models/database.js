const { Client, Pool } = require("pg");

const connect = async () => {
  /*const pgconnection = new Client({
    //*Template
    user: "avnadmin",
    password: "bcba6pfw9v5g6i68",
    host: "pg-2e07fd4b-dlsu-26dd.aivencloud.com",
    database: "movies_db",
    port: 14205,
    ssl: {rejectUnauthorized: false}
  }); */

  const pgconnection = new Pool({
    user: "avnadmin",
    password: "bcba6pfw9v5g6i68",
    host: "pg-2e07fd4b-dlsu-26dd.aivencloud.com",
    database: "movies_db",
    port: 14205,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {rejectUnauthorized: false}
  });

  pgconnection.connect((err, client, done) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Connected successfully to db');
  })

  global.pgconnection = pgconnection;
  
};

module.exports = { connect };
