const { Client } = require('pg');
const isTest = process.env.NODE_ENV === "test";
const connectString = isTest ? 'postgres://postgres@localhost/testdb' : process.env.DATABASE_URL;

client = new Client({
  connectionString: connectString,
  ssl: !isTest
});
client.connect();

module.exports = client;
