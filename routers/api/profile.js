const express = require('express');
const router = express.Router();
const ProfileController = require('../../controllers/Profile');
const passport = require('passport');

/**
 * HTTP GET REQUEST : api/profile/test
 * @description test route
 * @access public
 */
router.get('/test', ProfileController.test);


/**
 * HTTP GET REQUEST : api/profile/
 * @description test route
 * @access private
 */
router.get('/', passport.authenticate('jwt', { session: false }), ProfileController.loggedInUser);

/**
 * HTTP GET REQUEST : api/profile/
 * @description create or edit profile route
 * @access private
 */

router.post('/', passport.authenticate('jwt', { session: false }), ProfileController.createProfile);

/**
 * HTTP GET REQUEST : api/profile/handle/:handle
 * @description get profile by handle
 * @access public
 */

 router.get('/handle/:handle', ProfileController.getUserByHandle);

/**
 * HTTP GET REQUEST : api/user/:user_id/
 * @description get profile by user ID
 * @access public
 */

 router.get('/user/:user_id', ProfileController.getuserById);

/**
 * HTTP GET REQUEST : api/profile/all
 * @description get all profiles
 * @access public
 */

 router.get('/all', ProfileController.getAllProfile);

/**
 * HTTP POST REQUEST : api/profile/experiences
 * @description add user work experience
 * @access private
 */

 router.post('/experience', passport.authenticate('jwt', { session: false }), ProfileController.userExperience);
/**
 * HTTP POST REQUEST : api/profile/education
 * @description add user education
 * @access private
 */

 router.post('/education', passport.authenticate('jwt', { session: false }), ProfileController.userEducation);


 /**
 * HTTP DELET REQUEST : api/profile/experience/id
 * @description delete experience
 * @access private
 */

 router.delete('/experience/:id', passport.authenticate('jwt', { session: false }), ProfileController.deleteExperience);
 /**
 * HTTP DELET REQUEST : api/profile/education/id
 * @description delete education
 * @access private
 */

 router.delete('/education/:id', passport.authenticate('jwt', { session: false }), ProfileController.deletEducation);

 /**
 * HTTP DELET REQUEST : api/profile/
 * @description delete profile and user
 * @access private
 */
router.delete('/', passport.authenticate('jwt', { session:false }), ProfileController.userProfileDelete);
module.exports = router