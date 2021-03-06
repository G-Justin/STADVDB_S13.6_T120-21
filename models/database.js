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
    password: "jkfirhh08d4sywvv",
    host: "pg-9ad65a1-justingalura-cb35.aivencloud.com",
    database: "db_movies",
    port: 11669,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {rejectUnauthorized: false}
  });

  const olapconnection = new Pool({
    user: "avnadmin",
    password: "jkfirhh08d4sywvv",
    host: "pg-9ad65a1-justingalura-cb35.aivencloud.com",
    database: "dw_movies",
    port: 11669,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {rejectUnauthorized: false}
  })

  pgconnection.connect((err, client, done) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Connected successfully to db');
    olapconnection.connect((err, client, done) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log('Connected successfully to olap db');
    });
  });

  global.pgconnection = pgconnection;
  global.olapconnection = olapconnection;
  
};

module.exports = { connect };
