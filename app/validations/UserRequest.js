const User = require('../models/User');

const validateUserInput = async (input, checkEmailUnique = true) => {
  const errors = {};
  const requiredFields = ['name', 'email', 'dateofbirth'];

  requiredFields.forEach(field => {
    if (!input[field]) {
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(`The ${field} field is required.`);
    }
  });

  if (input.email && !/\S+@\S+\.\S+/.test(input.email)) {
    if (!errors.email) {
      errors.email = [];
    }
    errors.email.push('The email format is invalid.');
  }

  if (input.dateofbirth && !/^\d{4}-\d{2}-\d{2}$/.test(input.dateofbirth)) {
    if (!errors.dateofbirth) {
      errors.dateofbirth = [];
    }
    errors.dateofbirth.push('The dateofbirth format should be YYYY-MM-DD.');
  }

  if (checkEmailUnique && input.email && await isEmailTaken(input.email)) {
    if (!errors.email) {
      errors.email = [];
    }
    errors.email.push('The email address is already in use.');
  }

  return {
    errors: errors
  };
};

const isEmailTaken = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};


module.exports = {
  validateUserInput
};
