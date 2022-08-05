const express = require("express");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsById,
  postCommentsById,
} = require("./controllers/articles");
const { delCommentsById } = require("./controllers/comments");
const { getTopics } = require("./controllers/topics");
const { getUsers } = require("./controllers/users");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postCommentsById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", delCommentsById);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
  next();
});

/////////////////////////////////////////////

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else next;
});

module.exports = app;
