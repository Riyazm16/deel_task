const { validationResult, check } = require('express-validator');
const { utilityConstants } = require('../constants/constants');
const { logger } = require('../utils/logger');
const { expressErrorHandler } = require('../helper/commonHelper');

exports.validateGetContracts = [
  check('page')
    .trim()
    .exists()
    .not()
    .isEmpty()
    .isInt(utilityConstants.enums.minimumValidation),
  check('limit')
    .optional()
    .trim()
    .exists()
    .not()
    .isEmpty()
    .isInt(utilityConstants.enums.minimumValidation),
    check('id')
    .optional()
    .trim()
    .exists()
    .not()
    .isEmpty()
    .isInt(utilityConstants.enums.minimumValidation),
  check('sortBy')
    .optional()
    .trim()
    .exists()
    .not()
    .isEmpty(),
  check('orderBy')
    .optional()
    .trim()
    .exists()
    .not()
    .isEmpty()
    .isIn(utilityConstants.defaultOrderFields)
    .withMessage('Invalid orderBy field'),
  (req, res, next) => {
    try {
      logger.info('validateContracts@validateGetContracts');
      validationResult(req).throw();
      return next();
    } catch (err) {
      return res.status(utilityConstants.serviceResponseCodes.error).json(err.array());
    }
  },
];
