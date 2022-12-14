const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const toBeSortedBy = require("jest-sorted");

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

    test("should correctly count the amount of comments associated with ID", () => {
      return request(app)
        .get("/api/articles/1")
        .then(({ body: { article } }) => {
          expect(article[0].comment_count).toBe(11);
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

describe(`/api/articles/:article_id`, () => {
  describe("PATCH", () => {
    test("should return status code 200", () => {
      const values = { inc_votes: 1 };
      return request(app).patch("/api/articles/1").send(values).expect(200);
    });

    test("should update the votes by the provided amount", () => {
      const values = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(values)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBe(101);
        });
    });

    test("response should be an object", () => {
      const values = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(values)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(Array.isArray(body)).toBe(false);
        });
    });

    test("should contain all the correct properties after being updated", () => {
      const values = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(values)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(1);
          expect(article.title).toEqual(expect.any(String));
          expect(article.author).toEqual(expect.any(String));
          expect(article.body).toEqual(expect.any(String));
          expect(article.topic).toEqual(expect.any(String));
          expect(article.created_at).toEqual(expect.any(String));
          expect(article.votes).toEqual(expect.any(Number));
        });
    });

    test("should return a 400 error if requested endpoint is an invalid type", () => {
      const values = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/invalidpath")
        .send(values)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("should return a 404 error if requested id is not found", () => {
      const values = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/99999999")
        .send(values)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });

    test("should return a 400 error if provided value is an invalid type", () => {
      const values = { inc_votes: "Northcoders" };
      return request(app)
        .patch("/api/articles/1")
        .send(values)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("should return a 404 error if provided key is not votes", () => {
      const values = { northcoders: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(values)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Votes not found");
        });
    });
  });
});

describe(`/api/users`, () => {
  describe("GET", () => {
    test("should return status code 200", () => {
      return request(app).get("/api/users").expect(200);
    });

    test("should respond with an array of users", () => {
      return request(app)
        .get("/api/users")
        .then(({ body: { users } }) => {
          expect(Array.isArray(users)).toBe(true);
        });
    });

    test("response should be an object with the value of all users", () => {
      return request(app)
        .get("/api/users")
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(!Array.isArray(body)).toBe(true);
        });
    });

    test("returned user objects should have correct properties", () => {
      return request(app)
        .get("/api/users")
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user.username).toEqual(expect.any(String));
            expect(user.name).toEqual(expect.any(String));
            expect(user.avatar_url).toEqual(expect.any(String));
          });
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

describe(`/api/articles`, () => {
  describe("GET", () => {
    test("should return status code 200", () => {
      return request(app).get("/api/articles").expect(200);
    });

    test("should respond with an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
        });
    });

    test("response should be an object with the value of all articles", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(!Array.isArray(body)).toBe(true);
        });
    });

    test("should respond with the correct amount of articles", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
        });
    });

    test("articles should have a new property of comment_count which correctly counts all comments made associated with the article_id", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          expect(articles[0].hasOwnProperty("comment_count")).toBe(true);
          expect(articles[0].comment_count).toBe(2);
        });
    });

    test("response should have default ordering by date and default sorting of descending", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("should accept query to sort by specific column", () => {
      return request(app)
        .get("/api/articles?sort=votes")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });

    test("should accept query to specify ordering type", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });

    test("should accept query to filter response by article topic", () => {
      const query = "mitch";
      return request(app)
        .get(`/api/articles?topic=${query}`)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    test("should accept more than one query at a time", () => {
      return request(app)
        .get("/api/articles?sort=votes&order=asc")
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", { ascending: true });
        });
    });

    test("should accept all three queries at the same time", () => {
      const query = "mitch";
      return request(app)
        .get(`/api/articles?sort=votes&topic=${query}&order=asc`)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", { ascending: true });
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    test("should return an empty response if topic exists but there are no articles associated with it", () => {
      const query = "paper";
      return request(app)
        .get(`/api/articles?topic=${query}`)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(0);
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

    test("should return a 400 error if sort query is invalid", () => {
      return request(app)
        .get("/api/articles?sort=SQLInjection")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort query");
        });
    });

    test("should return a 400 error if order query is invalid", () => {
      return request(app)
        .get("/api/articles?order=SQLInjection")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query");
        });
    });

    test("should return a 404 error if topic does not exist", () => {
      const query = "liamsCounter";
      return request(app)
        .get(`/api/articles?topic=${query}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("should return status code 200", () => {
      return request(app).get("/api/articles/1/comments").expect(200);
    });

    test("should return status code 200 if article exists but with no comments", () => {
      return request(app).get("/api/articles/12/comments").expect(200);
    });

    test("should respond with an array of comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then(({ body: { comments } }) => {
          expect(Array.isArray(comments)).toBe(true);
        });
    });

    test("should respond with an empty array if article exists but with no comments", () => {
      return request(app)
        .get("/api/articles/12/comments")
        .then(({ body: { comments } }) => {
          expect(Array.isArray(comments)).toBe(true);
          expect(comments).toHaveLength(0);
        });
    });

    test("response should be an object with the value of all comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(!Array.isArray(body)).toBe(true);
        });
    });

    test("should respond with the correct amount of comments associated with article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
        });
    });

    test("returned comments should have correct properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(comment.comment_id).toEqual(expect.any(Number));
            expect(comment.body).toEqual(expect.any(String));
            expect(comment.author).toEqual(expect.any(String));
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
          });
        });
    });

    test("should return a 400 error if requested endpoint is an invalid type or syntax is malformed", () => {
      return request(app)
        .get("/api/articles/invalidpath/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("should return a 404 error if request is valid but id is not found", () => {
      return request(app)
        .get("/api/articles/99999999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });

  describe("POST", () => {
    test("should return status code 201", () => {
      const comments = {
        username: "icellusedkars",
        body: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(comments)
        .expect(201);
    });

    test("response should be an object", () => {
      const comments = {
        username: "icellusedkars",
        body: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(comments)
        .expect(201)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(Array.isArray(body)).toBe(false);
        });
    });

    test("response should have the correct comment properties", () => {
      const comments = {
        username: "icellusedkars",
        body: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(comments)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment[0].article_id).toBe(9);
          expect(comment[0].comment_id).toEqual(expect.any(Number));
          expect(comment[0].body).toEqual(expect.any(String));
          expect(comment[0].author).toEqual(expect.any(String));
          expect(comment[0].votes).toEqual(expect.any(Number));
          expect(comment[0].created_at).toEqual(expect.any(String));
        });
    });

    test("response should be the provided comment", () => {
      const comments = {
        username: "icellusedkars",
        body: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(comments)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment[0].body).toBe(comments.body);
          expect(comment[0].author).toBe(comments.username);
        });
    });

    test("should return a 400 error if requested endpoint is an invalid type", () => {
      const comments = {
        username: "icellusedkars",
        body: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/invalidpath/comments")
        .send(comments)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("should return a 404 error if article id is not found", () => {
      const comments = {
        username: "icellusedkars",
        body: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/99999999/comments")
        .send(comments)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });

    test("should return a 400 error if provided value is an invalid type", () => {
      const comments = {
        username: "icellusedkars",
        body: null,
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(comments)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("should return a 404 error if provided key is not username", () => {
      const comments = {
        northcoder: "northcoders",
        body: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(comments)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });

    test("should return a 404 error if provided key is not body", () => {
      const comments = {
        username: "icellusedkars",
        notbody: "Bring back liamsCounter",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(comments)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("should respond wih status code 204", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });

    test("should send back no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    test("should return a 400 error if requested endpoint is an invalid type", () => {
      return request(app)
        .delete("/api/comments/invalidpath")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("should return a 404 error if requested id is not found", () => {
      return request(app)
        .delete("/api/comments/99999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });
  });
});

describe("/api", () => {
  test("should respond with status code 200", () => {
    return request(app).get("/api").expect(200);
  });

  test("should respond with an object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(body)).toBe(false);
      });
  });

  test("should have the correct amount of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        const keys = Object.keys(endpoints);
        expect(keys).toHaveLength(9);
      });
  });
});
