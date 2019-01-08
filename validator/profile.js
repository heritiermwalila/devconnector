const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatorProfileInput(data){
    let errors = {};
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
    
    
   if(!validator.isLength(data.handle, {min:2, max:40})){
       errors.handle = 'Hanle need to be between 2 and 40 characteres'
   }
   if(validator.isEmpty(data.handle)){
       errors.handle = 'Profile handle is required'
   }
   if(validator.isEmpty(data.status)){
       errors.status = 'Status field is required'
   }
   if(validator.isEmpty(data.skills)){
       errors.skills = 'Status field is required'
   }

   if(!isEmpty(data.website)){
    if(!validator.isURL(data.website)){
        errors.website = 'Invalid URL'
    }
   }
   if(!isEmpty(data.youtube)){
    if(!validator.isURL(data.youtube)){
        errors.youtube = 'Invalid URL'
    }
   }
   if(!isEmpty(data.facebook)){
    if(!validator.isURL(data.facebook)){
        errors.facebook = 'Invalid URL'
    }
   }
   if(!isEmpty(data.twitter)){
    if(!validator.isURL(data.twitter)){
        errors.twitter = 'Invalid URL'
    }
   }
   if(!isEmpty(data.instagram)){
    if(!validator.isURL(data.instagram)){
        errors.instagram = 'Invalid URL'
    }
   }
   if(!isEmpty(data.googleplus)){
    if(!validator.isURL(data.googleplus)){
        errors.googleplus = 'Invalid URL'
    }
   }
   

    return {
        errors,
        isValid:isEmpty(errors)
    }
}