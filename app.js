const express = require("express");
const { getArticleById, patchArticleById } = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

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

module.exports = app;
