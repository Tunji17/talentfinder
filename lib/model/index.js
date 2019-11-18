const { ObjectModel, ArrayModel } = require('objectmodel');

const Candidate = new ObjectModel({
  id: String,
  name: String,
  skills:ArrayModel(String),
});

module.exports = {
  Candidate,
};