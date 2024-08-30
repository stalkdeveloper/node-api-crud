const User = require("../models/User");
const helper = require('../helpers/helper');

const validateUserInput = require("../validations/UserRequest").validateUserInput;

exports.create = (req, res) => {
  const validationErrors = validateUserInput(req.body);

  /* if (validationErrors.length > 0) {
    return res.status(400).send({ 
      message: `The following fields are missing: ${validationErrors.join(", ")}` 
    });
  } */

  if (Object.keys(validationErrors.errors).length > 0) {
    return res.status(400).send(validationErrors);
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    dateofbirth: req.body.dateofbirth
  });

  user
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Oops, something went wrong!"
      });
    });
};

exports.index = (req, res) => {
  User.find()
    .then(data => {
      res.status(200).send({
        status: 'success',
        message: 'Data get Successfully',
        data: data,
      })
      })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Oops, something went wrong!"
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { new: true, useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};
