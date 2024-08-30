const User = require("../models/User");
const helper = require('../helpers/helper');
const validateUserInput = require("../validations/UserRequest").validateUserInput;

exports.create = (req, res) => {
  const validationErrors = validateUserInput(req.body);

  if (Object.keys(validationErrors.errors).length > 0) {
      return res.status(400).json(helper.errorResponse('Validation failed', validationErrors.errors));
  }

  const user = new User({
      name: req.body.name,
      email: req.body.email,
      dateofbirth: req.body.dateofbirth
  });

  user.save()
      .then(data => {
          res.status(201).json(helper.successResponse('User created successfully', data));
      })
      .catch(err => {
          res.status(500).json(helper.errorResponse('Error creating user', { error: err.message }));
      });
};

exports.index = (req, res) => {
  User.find()
    .then(data => {
      res.status(200).json(helper.successResponse('Data retrieved successfully', data));
    })
    .catch(err => {
      res.status(500).json(helper.errorResponse('Error retrieving users', { error: err.message }))
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data) {
        const message = `User with id=${id} not found`;
        res.status(404).json(helper.errorResponse(message, { global: [message] }));
      } else {
        res.status(200).json(helper.successResponse('Data retrieved successfully', data));
      }
    })
    .catch(err => {
      console.error(`Error retrieving user with id=${id}:`, err); // Log error for debugging
      res.status(500).json(helper.errorResponse(`Error retrieving user with id=${id}`, { global: [err.message] }));
    });
};


exports.update = (req, res) => {
  const validationErrors = validateUserInput(req.body);

  if (Object.keys(validationErrors.errors).length > 0) {
    return res.status(400).json(helper.errorResponse('Validation failed', validationErrors.errors));
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { new: true, useFindAndModify: false })
    .then(data => {
      if (!data) {
        const message = `Cannot update User with id=${id}. Maybe User was not found!`;
        res.status(404).json(helper.errorResponse(message, { global: [message] }));
      } else {
        res.status(200).json(helper.successResponse('User was updated successfully.', data));
      }
    })
    .catch(err => {
      console.error(`Error updating user with id=${id}:`, err);
      res.status(500).json(helper.errorResponse(`Error updating user with id=${id}`, { global: [err.message] }));
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        const message = `Cannot delete User with id=${id}. Maybe User was not found!`;
        res.status(404).json(helper.errorResponse(message, { global: [message] }));
      } else {
        res.status(200).json(helper.successResponse('User was deleted successfully!'));
      }
    })
    .catch(err => {
      console.error(`Error deleting user with id=${id}:`, err);
      res.status(500).json(helper.errorResponse(`Could not delete User with id=${id}`, { global: [err.message] }));
    });
};


exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.status(200).json(helper.successResponse(`${data.deletedCount} Users were deleted successfully!`));
    })
    .catch(err => {
      console.error('Error deleting all users:', err);
      res.status(500).json(helper.errorResponse('Some error occurred while removing all users', { global: [err.message] }));
    });
};

