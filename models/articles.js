const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((articles) => {
      const article = articles.rows;

      if (article.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad request, invalid ID",
        });
      }

      return article;
    });
};
