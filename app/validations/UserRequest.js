const validateUserInput = (input) => {
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

  return {
    errors: errors
  };
};

module.exports = {
  validateUserInput
};
