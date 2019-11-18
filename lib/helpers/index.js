const { badRequest } = require('@hapi/boom');
const joi = require('@hapi/joi');
var _ = require('underscore');

 /**
     * @description helper function to send response data
     * @param {object} res response object
     * @param {Number} status response status code
     * @param {object} data response data
     * @param {String} method request method
     * @param {String} message response message
     * 
     * @returns {object} returns json data
     *
     */
const sendJSONResponse = (res, status, data, method, message) => {
  res.status(status);
  res.json({
    status,
    method,
    message,
    data,
  });
};

 /**
     * @description catches errors in the function passed into it
     * @param {object} req request object
     * @param {object} res response object
     * @param {object} next moves to the next function
     *
     */

const catchErrors = (fn) => (req, res, next) => fn(req, res, next).catch(next);

 /**
     * @description validates request body schema
     * @param {object} schema  request object
     * @param {object} options
     * @returns {object} error object if something is not right with the schema
     */

const validate = (schema, options) => {
  const requestOptions = options || {};

  return function validateRequest(req, res, next) {
    const toValidate = {};
    /* istanbul ignore if */
    if (!schema) {
      return next();
    }

    ['params', 'body', 'query'].forEach((key) => {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });

    function onValidationComplete(err, validated) {
      if (err) {
        return next(badRequest(err.message, err.details));
      }

      // copy the validated data to the req object
      Object.assign(req, validated);

      return next();
    }
    return joi.validate(toValidate, schema, requestOptions, onValidationComplete);
  };
};

/**
   * Save item to memory
   *
   * @param {*} key Object key
   * @param {*} value item to save
   */
const save = (key, value) => global.db[key] = [...global.db[key], value];

/**
   * Save item to memory
   *
   * @param {Array} skills array to make sure includes target array
   * @param {Array} perfectCandidateSkills target array
   * @returns {Boolean} 
   */
const compareArray = (skills, perfectCandidateSkills) => perfectCandidateSkills.every(v => skills.includes(v));

/**
 * retreive user object from memory using email
 *
 * @param {Array} skillsArray array containing req.query
 * @returns user object
 */
const findCandidateBySkills = (skillsArray) => {
  let perfectCandidateSkills = '';
  const perfectMatch = [];
  if (global.db.Candidate.length < 1) {
    return false;
  }
  global.db.Candidate.map((iter) => {
    const longestMatch = _.intersection(skillsArray, iter.skills);
    if (longestMatch.length > perfectCandidateSkills.length) {
      perfectCandidateSkills = longestMatch
    }
    return;
  });
  global.db.Candidate.map((iter) => {
    const { skills } = iter;
    console.log('perfcsk', perfectCandidateSkills);
    const response = compareArray(skills, perfectCandidateSkills)
    console.log(response);
    if (response) {
      return perfectMatch.push(iter);
    }
    return false;
  });
  return perfectMatch;
};


module.exports = {
  sendJSONResponse,
  catchErrors,
  validate,
  save,
  findCandidateBySkills,
};
