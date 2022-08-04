exports.articleError = () => {
  return Promise.reject({
    status: 404,
    msg: "Article not found",
  });
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
