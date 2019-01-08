const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatorRegisterInput(data){
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    
    if(!validator.isLength(data.name, { min: 2, max: 30 })){
        errors.name = 'Name must be between 2 and 30 characters'
    }
    if(validator.isEmpty(data.name)){
        errors.name = 'Name field is required';
    }
    if(validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Invalid email'
    }

    if(validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    }
    if(!validator.isLength(data.password, {min:6})){
        errors.password = 'The password must be at least 6 characters'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}