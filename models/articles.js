const db = require("../db/connection");
const { articleError, votesError } = require("./customerrors");

exports.selectAllArticles = () => {
  return db
    .query(
      "SELECT articles.*, CAST((SELECT COUNT(*) AS comment_count FROM comments WHERE comments.article_id = articles.article_id) AS INT) FROM articles ORDER BY created_at DESC"
    )
    .then((articles) => {
      return articles.rows;
    });
};

exports.selectArticleById = (id) => {
  return db
    .query(
      "SELECT articles.*, CAST((SELECT COUNT(*) AS comment_count FROM comments WHERE comments.article_id = articles.article_id) AS INT) FROM articles WHERE article_id = $1 ",
      [id]
    )
    .then((articles) => {
      const article = articles.rows;

      if (article.length === 0) {
        return articleError();
      }

      return article;
    });
};

exports.updateArticleById = (id, newValues) => {
  if (!newValues.hasOwnProperty("inc_votes")) return votesError();

  const { inc_votes } = newValues;
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return articleError();
      }

      return article.rows;
    });
};
