const uuidv4 = require('uuid/v4');
const { Candidate: candidateModel } = require('../model');
const { sendJSONResponse, save, findCandidateBySkills } = require('../helpers');

 /**
     * @description Creates a candidate
     * @param {object} req request object
     * @param {object} res response object
     * @returns {object} returns success message and null data
     *
     */
const create = async (req, res) => {
  const id = uuidv4();
  const payload = {id, ...req.body};
  const candidate = new candidateModel(payload);
  save('Candidate', candidate);
  return sendJSONResponse(res, 200, null, req.method, 'Candidate created successfully');
};

 /**
     * @description Reads the best candidate(s) for the job
     * @param {object} req request object
     * @param {object} res response object
     * @returns {object} returns candidates data
     *
     */

const read = async (req, res) => {
  const { skills } = req.query;
  const skillsArray = skills.split(',');
  const bestMatch = findCandidateBySkills(skillsArray)
  if (!bestMatch) {
    return sendJSONResponse(res, 404, null, req.method, 'We do not have a candidate that meets your query');
  }
  return sendJSONResponse(res, 200, bestMatch, req.method, 'Here is our best match');
};

module.exports = {
  create,
  read,
};