exports.articleColumns = [
  "title",
  "topic",
  "author",
  "body",
  "created_at",
  "votes",
  "article_id",
];
exports.commentError = () => {
  return Promise.reject({
    status: 404,
    msg: "Comment not found",
  });
};
exports.articleError = () => {
  return Promise.reject({
    status: 404,
    msg: "Article not found",
  });
};

exports.topicError = () => {
  return Promise.reject({
    status: 404,
    msg: "Topic not found",
  });
};

exports.articleSortError = () => {
  return Promise.reject({ status: 400, msg: "Invalid sort query" });
};

exports.articleOrderError = () => {
  return Promise.reject({ status: 400, msg: "Invalid order query" });
};

exports.votesError = () => {
  return Promise.reject({
    status: 404,
    msg: "Votes not found",
  });
};

exports.userError = () => {
  return Promise.reject({
    status: 404,
    msg: "User not found",
  });
};
