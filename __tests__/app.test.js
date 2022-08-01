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
