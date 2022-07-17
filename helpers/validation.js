const Joi = require('joi');

module.exports = function userValidate(data) {
    userObject = {
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(2).max(32).required()
    }
  
    return Joi.object(userObject).validate(data);
}

