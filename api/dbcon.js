const { Client } = require('pg');
const isTest = process.env.NODE_ENV === "test";
const connectString = isTest ? 'postgres://localhost/testdb' : process.env.DATABASE_URL;

console.log("DATABASE_URL: ", process.env.DATABASE_URL);
console.log("isTest: ", isTest);
console.log("connectString: ", connectString);

db = new Client({
  connectionString: connectString,
  ssl: !isTest
});
db.connect();

module.exports = db;
