const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe(`/api/topics`, () => {
  describe("GET", () => {
    test("should return status code 200", () => {
      return request(app).get("/api/topics").expect(200);
    });

    test("should respond with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body: { topics } }) => {
          expect(Array.isArray(topics.topics)).toBe(true);
        });
    });

    test("should respond with all topics", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body: { topics } }) => {
          expect(topics.topics).toHaveLength(3);
        });
    });

    test("should respond with an object containing all topics", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body: { topics } }) => {
          expect(topics).toEqual({
            topics: [
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              },
              {
                description: "Not dogs",
                slug: "cats",
              },
              {
                description: "what books are made of",
                slug: "paper",
              },
            ],
          });
        });
    });

    test("topics should have correct properties", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body: { topics } }) => {
          expect(topics.topics[0].hasOwnProperty("slug")).toBe(true);
          expect(topics.topics[0].hasOwnProperty("description")).toBe(true);
        });
    });

    test("should return a 404 error if path does not exist", () => {
      return request(app)
        .get("/api/invalidpath")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found!");
        });
    });
  });
});

describe(`/api/articles/:article_id`, () => {
  describe("GET", () => {
    test("should return status code 200", () => {
      return request(app).get("/api/articles/1").expect(200);
    });

    test("should respond with an array of articles", () => {
      return request(app)
        .get("/api/articles/1")
        .then(({ body }) => {
          expect(Array.isArray(body.article)).toBe(true);
        });
    });

    test("should respond with only the article matching the id", () => {
      return request(app)
        .get("/api/articles/1")
        .then(({ body }) => {
          expect(body.article).toHaveLength(1);
        });
    });

    test("should respond with an object containing the matched article with the correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .then(({ body: { article } }) => {
          expect(article[0]).toBeInstanceOf(Object);
          expect(article[0].article_id).toBe(1);
          expect(article[0].title).toEqual(expect.any(String));
          expect(article[0].author).toEqual(expect.any(String));
          expect(article[0].body).toEqual(expect.any(String));
          expect(article[0].topic).toEqual(expect.any(String));
          expect(article[0].created_at).toEqual(expect.any(String));
          expect(article[0].votes).toEqual(expect.any(Number));
        });
    });

    test("should return a 400 error if requested endpoint is an invalid type", () => {
      return request(app)
        .get("/api/articles/invalidpath")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("should return a 404 error if requested id is not found", () => {
      return request(app)
        .get("/api/articles/99999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });
});
