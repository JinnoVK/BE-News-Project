const { selectAllTopics } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: { topics } });
    })
    .catch(next);
};
