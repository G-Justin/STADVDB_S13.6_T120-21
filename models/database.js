const { Client } = require("pg");

const connect = async () => {
  const pgconnection = new Client({
    //*Template
    user: "admin",
    password: "password",
    host: "localhost",
    database: "movies",
  });

  try {
    await pgconnection.connect();
    console.log("Successfully connected to PostgreSQL db");
    global.pgconnection = pgconnection;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connect };
