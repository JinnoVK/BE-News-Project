const express = require("express");
const { getTopics } = require("./controllers/topics");
const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
  next();
});

/////////////////////////////////////////////

module.exports = app;
