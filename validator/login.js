const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatorLoginInput(data){
    let errors = {};
   
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    
    if(validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Invalid email'
    }

    if(validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    }
    

    return {
        errors,
        isValid:isEmpty(errors)
    }
}