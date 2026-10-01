const { body, param, validationResult } = require("express-validator");
const { TASK_STATUSES } = require("../config/constants");
const { ApiError } = require("./errorHandler");

// Runs after the rules; turns the first failure into a 400 error
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, errors[0].message, errors));
};

const idParam = param("id").isMongoId().withMessage("Invalid id");

const name = body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }).withMessage("Name is too long");
const email = body("email").trim().toLowerCase().isEmail().withMessage("A valid email is required");
const statusRule = body("status").optional().isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(", ")}`);

const validators = {
  signup: [
    name,
    email,
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    validate,
  ],

  login: [
    email,
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],

  id: [idParam, validate],

  createProject: [name, validate],

  updateProject: [idParam, name, validate],

  createTask: [
    idParam,
    body("title").trim().notEmpty().withMessage("Task title is required").isLength({ max: 200 }).withMessage("Task title is too long"),
    statusRule,
    validate,
  ],

  updateTask: [
    idParam,
    body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty").isLength({ max: 200 }).withMessage("Task title is too long"),
    statusRule,
    validate,
  ],
};

module.exports = validators;
