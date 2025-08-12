// backend/middleware/feedbackValidator.js
const { check, validationResult } = require('express-validator');

// Mirror the frontend BADGES IDs
const ALLOWED_BADGES = ['friendly', 'punctual', 'helpful'];

const feedbackValidationRules = [
  check('rating')
    .exists().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  check('badges')
    .optional()
    .isArray().withMessage('Badges must be an array')
    .bail()
    .custom(arr => arr.every(id => ALLOWED_BADGES.includes(id)))
      .withMessage('Badges contain invalid values'),
  check('comments')
    .optional({ nullable: true })
    .isString().withMessage('Comments must be text')
    .isLength({ max: 500 }).withMessage('Comments cannot exceed 500 characters'),
];

const validateFeedback = [
  ...feedbackValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return first failure or full array as needed
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateFeedback;
