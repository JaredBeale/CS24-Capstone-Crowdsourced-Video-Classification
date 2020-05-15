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
    
    expect(response.body).toHaveProperty("success");
  });

  it("fails creating duplicate username", async () => {
    const response = await request(app)
      .post("/api/create/user")
      .send({name: "testUser"})
      .expect(400);
    
    expect(response.body).toHaveProperty("content");
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
    await db.query("DELETE FROM Votes;");
    await db.query("DELETE FROM Users;");
    await db.query("DELETE FROM Videos;");
    await db.query("DELETE FROM Labels;");
  });

  it("succeeds creating new vote while video is not checked out", async () => {
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX}`, video: "testVideo1", label: "testLabel"})
      .expect(200);

    expect(response.body).toHaveProperty("success");
    expect(typeof response.body.success).toBe("string");
  });

  it("succeeds creating new vote while video is checked out", async () => {
    await request(app).get("/api/videos/select/username/testUser");
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX}`, video: "testVideo2", label: "testLabel"})
      .expect(200);

    expect(response.body).toHaveProperty("success");
    expect(typeof response.body.success).toBe("string");
  });

  it("fails creating vote while video is not checked out and does not need votes", async () => {
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX + 1}`, video: "testVideo1", label: "testLabel"})
      .expect(400);

    expect(response.body).toHaveProperty("content");
    expect(typeof response.body.content).toBe("string");
  });

  it("fails creating duplicate vote", async () => {
    const response = await request(app)
      .post("/api/create/vote")
      .send({user: `testUser${LABEL_MAX}`, video: "testVideo2", label: "testLabel"})
      .expect(500);

    expect(response.body).toHaveProperty("content");
    expect(typeof response.body.content).toBe("string");
  });
});

describe("GET /api/names/user", () => {
  beforeAll(async () => {
    await db.query("INSERT INTO Users (username) VALUES ('testUser1'), ('testUser2'), ('testUser3');");
  });

  afterAll(async () => {
    await db.query("DELETE FROM Users;");
  })

  it("succeeds in fetching singleton list of existing user", async () => {
    const response = await request(app)
      .get("/api/names/user/testUser2")
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining(['testUser2']));
  });

  it("succeeds in fetching empty list of missing user", async () => {
    const response = await request(app)
      .get("/api/names/user/testUser4")
      .expect(200);

    expect(response.body).toEqual([]);
  });
});

describe("GET /api/names/labels", () => {
  beforeAll(async () => {
    await db.query("INSERT INTO Labels (labelTitle) VALUES ('testLabel1'), ('testLabel2'), ('testLabel3');");
  });

  afterAll(async () => {
    await db.query("DELETE FROM Labels;");
  })

  it("succeeds in generating a list of labels", async () => {
    const response = await request(app)
      .get("/api/names/labels")
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining(['testLabel1', 'testLabel2', 'testLabel3']));
  });
});

describe("GET /api/videos/select/username/:username", () => {
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
      voteString += `((SELECT id FROM Users WHERE username = 'testUser${i}'), (SELECT id FROM Labels WHERE labelTitle = 'testLabel'), (SELECT id FROM Videos WHERE fileTitle = 'testVideo1')), `;
    voteString = voteString.substring(0, voteString.length - 2).concat(";");
    await db.query(voteString);
  });

  afterAll(async () => {
    await db.query("DELETE FROM Votes;");
    await db.query("DELETE FROM Users;");
    await db.query("DELETE FROM Videos;");
    await db.query("DELETE FROM Labels;");
  });

  it("succeeds selecting partially labeled video first", async () => {
    const response = await request(app)
      .get(`/api/videos/select/username/testUser${LABEL_MAX}`)
      .expect(200);

    expect(response.body).toHaveProperty("url");
    expect(response.body).toHaveProperty("fileid");
    expect(typeof response.body.url).toBe("string");
    expect(typeof response.body.fileid).toBe("string");
    expect(response.body.fileid).toBe("testVideo1");
  });

  it("succeeds in not selecting checked out video", async () => {
    const response = await request(app)
      .get(`/api/videos/select/username/testUser${LABEL_MAX + 1}`)
      .expect(200);

    expect(response.body).toHaveProperty("url");
    expect(response.body).toHaveProperty("fileid");
    expect(typeof response.body.url).toBe("string");
    expect(typeof response.body.fileid).toBe("string");
    expect(response.body.fileid).toBe("testVideo2");
  });

  it("succeeds selecting unseen video next", async () => {
    await db.query(`INSERT INTO Votes (userid, labelid, videoid) VALUES ((SELECT id FROM Users WHERE username = 'testUser${LABEL_MAX}'), (SELECT id FROM Labels WHERE labelTitle = 'testLabel'), (SELECT id FROM Videos WHERE fileTitle = 'testVideo1'));`)
    const response = await request(app)
      .get(`/api/videos/select/username/testUser${LABEL_MAX}`)
      .expect(200);

    expect(response.body).toHaveProperty("url");
    expect(response.body).toHaveProperty("fileid");
    expect(typeof response.body.url).toBe("string");
    expect(typeof response.body.fileid).toBe("string");
    expect(response.body.fileid).toBe("testVideo2");
  });

  it("fails with label task over when no valid videos exist", async () => {
    await db.query(`INSERT INTO Votes (userid, labelid, videoid) VALUES ((SELECT id FROM Users WHERE username = 'testUser${LABEL_MAX}'), (SELECT id FROM Labels WHERE labelTitle = 'testLabel'), (SELECT id FROM Videos WHERE fileTitle = 'testVideo2'));`)
    const response = await request(app)
      .get(`/api/videos/select/username/testUser${LABEL_MAX}`)
      .expect(500);

    expect(response.body).toHaveProperty("content");
    expect(typeof response.body.content).toBe("string");
  });
});

describe("GET /api/votes/count/:username", () => {
  beforeAll(async () => {
    await db.query("INSERT INTO Users (username) VALUES ('testUser');");
    await db.query("INSERT INTO Labels (labelTitle) VALUES ('testLabel');");
    await db.query("INSERT INTO Videos (fileTitle) VALUES ('testVideo');");
    await db.query("INSERT INTO Votes (userid, labelid, videoid) VALUES ((SELECT id FROM Users WHERE username = 'testUser'), (SELECT id FROM Labels WHERE labelTitle = 'testLabel'), (SELECT id FROM Videos WHERE fileTitle = 'testVideo'));");
  });

  afterAll(async () => {
    await db.query("DELETE FROM Votes;");
    await db.query("DELETE FROM Users;");
    await db.query("DELETE FROM Videos;");
    await db.query("DELETE FROM Labels;");
  });

  it("succeeds in getting vote count for username", async () => {
    const response = await request(app)
      .get("/api/votes/count/testUser")
      .expect(200);

    expect(response.body).toBe("1");
  });
});
