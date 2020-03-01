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
});
/*
beforeEach(async () => {
  await db.query("INSERT INTO Videos (fileTitle) VALUES ('testVideo1'), ('testVideo2');");
  await db.query("INSERT INTO Labels (labelTitle) VALUES ('testLabel');");
  
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
  afterAll(async () => {
    await db.query("DELETE FROM Users");
  });

  it("succeeds creating new username", async () => {
    const response = await request(app)
      .post("/api/create/user")
      .send({name: "testUser"})
      .expect(200);
    
    expect(response.text).toContain("success");
  });

  it("fails creating duplicate username", async () => {
    const response = await request(app)
      .post("/api/create/user")
      .send({name: "testUser"})
      .expect(400);
    
    expect(response.text).toContain("content");
  });
});

describe("POST /api/create/vote endpoint", () => {
  beforeAll(async () => {
    await db.query("INSERT INTO Videos (fileTitle) VALUES ('testVideo1'), ('testVideo2');");
    await db.query("INSERT INTO Labels (labelTitle) VALUES ('testLabel');");
    
    let userString = "INSERT INTO Users (username) VALUES ";
    for (let i = 1; i <= LABEL_MAX + 1; i++)
      userString += `('testUser${i}'), `;
    userString = userString.substring(0, userString.length - 2).concat(";");
    await db.query(userString);
    
    let voteString = "INSERT INTO Votes (userid, labelid, videoid) VALUES ";
    for (let i = 1; i < LABEL_MAX; i++)
      voteString += `((SELECT id FROM Users WHERE username = 'testUser${i}'), 1, 1), `;
    voteString = voteString.substring(0, voteString.length - 2).concat(";");
    await db.query(voteString);
  });

  afterAll(async () => {
    await db.query("DELETE FROM Votes");
    await db.query("DELETE FROM Users");
    await db.query("DELETE FROM Videos");
    await db.query("DELETE FROM Labels");
  });

  it("succeeds creating new vote while video is not checked out", async () => {
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX}`, video: "testVideo1", label: "testLabel"})
      .expect(200);

    expect(response.text).toContain("success");
  });

  it("succeeds creating new vote while video is checked out", async () => {
    await request(app).get("/api/videos/select/username/testUser");
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX}`, video: "testVideo2", label: "testLabel"})
      .expect(200);

    expect(response.text).toContain("success");
  });

  it("fails creating vote while video is not checked out and does not need votes", async () => {
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX + 1}`, video: "testVideo1", label: "testLabel"})
      .expect(400);

    expect(response.text).toContain("content");
  });

  it("fails creating duplicate vote", async () => {
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX}`, video: "testVideo2", label: "testLabel"})
      .expect(500);

    expect(response.text).toContain("content");
  });
});
