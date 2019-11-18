const express = require('express');
const controller = require('../controllers');
const policy = require('../policies');
const { catchErrors, validate } = require('../helpers');

const router = express.Router();

router.post(
  '/candidate',
  validate(policy.create),
  catchErrors(controller.create),
);
router.get(
  '/candidates/search',
  validate(policy.read),
  catchErrors(controller.read),
);



module.exports = router;
