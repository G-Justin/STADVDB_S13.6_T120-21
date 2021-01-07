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

 return;
  try {
    let rows = await pgconnection.query(` 
    SELECT title, revenue-budget AS gross_income
    FROM metadata
    WHERE EXTRACT(year from metadata.release_date) = 2005
    ORDER BY gross_income DESC
    LIMIT 10 
  `);

  console.log(rows.rows);
  } catch (error) {
    console.log(error);
  }
  
};

module.exports = { connect };
