const db = require("../db/connection");
const { commentError } = require("./customerrors");

exports.removeCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [id])
    .then((res) => {
      if (!res.rowCount) return commentError();
      return res.rows;
    });
};
