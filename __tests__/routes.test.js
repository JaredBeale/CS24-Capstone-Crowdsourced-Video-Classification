process.env.NODE_ENV = "test";
const db = require("../api/dbcon");
const request = require("supertest");
const LABEL_MAX = require("../api/routes").LABEL_MAX;
const app = require("../app");

beforeAll(async () => {
  await db.query("CREATE TABLE Users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE)");
  await db.query("CREATE TABLE Videos (id SERIAL PRIMARY KEY, fileTitle TEXT NOT NULL UNIQUE)");
  await db.query("CREATE TABLE Labels (id SERIAL PRIMARY KEY, labelTitle TEXT NOT NULL)");
  await db.query("CREATE TABLE Votes (id SERIAL PRIMARY KEY, userid INTEGER REFERENCES Users (id) ON DELETE CASCADE, videoid INTEGER REFERENCES Videos (id) ON DELETE CASCADE , labelid INTEGER REFERENCES Labels (id) ON DELETE CASCADE, UNIQUE (userid, videoid, labelid));");
  await db.query("INSERT INTO Videos (fileTitle) VALUES ('testVideo1'), ('testVideo2');");
  await db.query("INSERT INTO Labels (labelTitle) VALUES ('Joy');");
  
  let userString = "INSERT INTO Users (username) VALUES ";
  for (let i = 1; i <= LABEL_MAX; i++)
    userString += `('testUser${i}'), `;
  userString = userString.substring(0, userString.length - 2).concat(";");
  await db.query(userString);
  
  let voteString = "INSERT INTO Votes (userid, labelid, videoid) VALUES ";
  for (let i = 1; i < LABEL_MAX; i++)
    voteString += `(${i}, 1, 1), `;
  voteString = voteString.substring(0, voteString.length - 2).concat(";");
  await db.query(voteString);
});
/*
beforeEach(async () => {
  await db.query("INSERT INTO Videos (fileTitle) VALUES ('testVideo1'), ('testVideo2');");
  await db.query("INSERT INTO Labels (labelTitle) VALUES ('Joy');");
  
  let userString = "INSERT INTO Users (username) VALUES ";
  for (let i = 1; i <= LABEL_MAX; i++)
    userString += `('testUser${i}'), `;
  userString = userString.substring(0, userString.length - 2).concat(";");
  await db.query(userString);
  
  let voteString = "INSERT INTO Votes (userid, labelid, videoid) VALUES ";
  for (let i = 1; i < LABEL_MAX; i++)
    voteString += `(${i}, 1, 1), `;
  voteString = voteString.substring(0, voteString.length - 2).concat(";");
  await db.query(voteString);
});

afterEach(async () => {
  await db.query("DELETE FROM Votes");
  await db.query("DELETE FROM Users");
  await db.query("DELETE FROM Videos");
  await db.query("DELETE FROM Labels");
});
*/
afterAll(async () => {
  await db.query("DROP TABLE IF EXISTS Votes");
  await db.query("DROP TABLE IF EXISTS Users");
  await db.query("DROP TABLE IF EXISTS Videos");
  await db.query("DROP TABLE IF EXISTS Labels");
  db.end();
});

describe("POST /api/create/user endpoint", () => {
  it("succeeds with a new username", async () => {
    const response = await request(app)
      .post("/api/create/user")
      .send({name: "newTestUser"})
      .expect(200);
    
    expect(response.text).toContain("success");
  });

  it("fails with taken username", async () => {
    const response = await request(app)
      .post("/api/create/user")
      .send({name: "testUser1"})
      .expect(400);
    
    expect(response.text).toContain("content");
  });
});
