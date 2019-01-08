const express = require('express');
const UserController = require('../../controllers/User');
const router = express.Router();
const passport = require('passport')

/**
 * HTTP GET REQUEST : api/users/test
 * @description test the route
 * @access Public
 */
router.get('/test', UserController.test);

/**
 * HTTP POST REQUEST : api/users/register
 * @description Register a user route
 * @access Public
 */

 router.post('/register', UserController.registerUser)

 /**
 * HTTP POST REQUEST : api/users/login
 * @description Login a user route return a json wen token
 * @access Public
 */

 router.post('/login', UserController.loginUser)

 /**
 * HTTP POST REQUEST : api/users/current
 * @description current user
 * @access Private
 */

 router.get('/current', passport.authenticate('jwt', { session: false }),
 (req, res)=>{
     res.json({
         id:req.user.id,
         name:req.user.name,
         email:req.user.email,
     });
})

module.exports = router