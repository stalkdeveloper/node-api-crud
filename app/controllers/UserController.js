const User = require("../models/User");
const helper = require('../helpers/helper');
const { validateUserInput } = require('../validations/UserRequest');

exports.create = async (req, res) => {
  try {
    const validationErrors = await validateUserInput(req.body);
    if (Object.keys(validationErrors.errors).length > 0) {
      return res.status(400).json(helper.errorResponse('Validation failed', validationErrors.errors));
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      dateofbirth: req.body.dateofbirth
    });

    const data = await user.save();
    res.status(201).json(helper.successResponse('User created successfully', data));
  } catch (err) {
    res.status(500).json(helper.errorResponse('Error creating user', { error: err.message }));
  }
};


exports.index = async (req, res) => {
  try {
    const data = await User.find().sort('name');
    res.status(200).json(helper.successResponse('Data retrieved successfully', data));
  } catch (err) {
    res.status(500).json(helper.errorResponse('Error retrieving users', { global: [err.message] }));
  }
};


exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await User.findById(id);
    if (!data) {
      const message = `User with id=${id} not found`;
      return res.status(404).json(helper.errorResponse(message, { global: [message] }));
    }
    res.status(200).json(helper.successResponse('Data retrieved successfully', data));
  } catch (err) {
    console.error(`Error retrieving user with id=${id}:`, err);
    res.status(500).json(helper.errorResponse(`Error retrieving user with id=${id}`, { global: [err.message] }));
  }
};



exports.update = async (req, res) => {
  const validationErrors = await validateUserInput(req.body, false);
  if (Object.keys(validationErrors.errors).length > 0) {
    return res.status(400).json(helper.errorResponse('Validation failed', validationErrors.errors));
  }
  
  const id = req.params.id;
  try {
    const data = await User.findByIdAndUpdate(id, req.body, { new: true, useFindAndModify: false });
    if (!data) {
      const message = `Cannot update User with id=${id}. Maybe User was not found!`;
      return res.status(404).json(helper.errorResponse(message, { global: [message] }));
    }
    res.status(200).json(helper.successResponse('User was updated successfully.', data));
  } catch (err) {
    console.error(`Error updating user with id=${id}:`, err);
    res.status(500).json(helper.errorResponse(`Error updating user with id=${id}`, { global: [err.message] }));
  }
};



exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await User.findByIdAndDelete(id, { useFindAndModify: false });
    if (!data) {
      const message = `Cannot delete User with id=${id}. Maybe User was not found!`;
      return res.status(404).json(helper.errorResponse(message, { global: [message] }));
    }
    res.status(200).json(helper.successResponse('User was deleted successfully!'));
  } catch (err) {
    console.error(`Error deleting user with id=${id}:`, err);
    res.status(500).json(helper.errorResponse(`Could not delete User with id=${id}`, { global: [err.message] }));
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const data = await User.deleteMany({});
    res.status(200).json(helper.successResponse(`${data.deletedCount} Users were deleted successfully!`));
  } catch (err) {
    console.error('Error deleting all users:', err);
    res.status(500).json(helper.errorResponse('Some error occurred while removing all users', { global: [err.message] }));
  }
};


