const refreshDbState = () => {
  global.db = {
    Candidate: [],
  };

}

module.exports = {
  refreshDbState,
};