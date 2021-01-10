const { Client } = require("pg");

const connect = async () => {
  const pgconnection = new Client({
    //*Template
    user: "avnadmin",
    password: "bcba6pfw9v5g6i68",
    host: "pg-2e07fd4b-dlsu-26dd.aivencloud.com",
    database: "movies_db",
    port: 14205,
    ssl: {rejectUnauthorized: false}
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
