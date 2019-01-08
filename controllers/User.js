const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secretKey = require('../config/keys').secretKey;
const passport = require('passport');
const validatorRegisterInput = require('../validator/register');
const validatorLoginInput = require('../validator/login');



exports.test = (req, res)=>{
     res.json({msg:'Users works'});
}

exports.registerUser = (req, res)=>{
    const {errors, isValid} = validatorRegisterInput(req.body);
    //check validation
    if(!isValid){
         res.status(400).json(errors);
    }
    User.findOne({email:req.body.email}).then(user=>{
        if(user){
            errors.email = 'Email already exist'
            return res.status(400).json(errors);
        }else{
            const avatar = gravatar.url(req.body.email, {
                s:'200', //size,
                r:'pg', //rating
                d:'mm'

            });
            
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                avatar,

            })
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user=>{
                         res.json(user);
                    }).catch(error=>console.log(error))
                })
            })
        }
    })
}

exports.loginUser = (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const {errors, isValid} = validatorLoginInput(req.body)
    //check login input
    if(!isValid){
         res.status(400).json(errors);
    }
    //find a user by email
    User.findOne({email}).then(user=>{
        //check if the user exist
        if(!user){
            errors.email = 'User not found'
            res.status(404).json(errors);
        }else{
            //check the password
            bcrypt.compare(password, user.password).then(isMatch=>{

                if(isMatch){
                    //user matched
                    const payload = {id:user.id, name:user.name, avatar:user.avatar} //user payload
                    //asign token
                    jwt.sign(payload, secretKey, { expiresIn:36000 }, (err, token)=>{
                         res.json({
                             success:true,
                             token:'Bearer ' + token
                         });
                    });
                }else{
                    errors.errorPassword = 'Incorrect Password';
                    return res.status(400).json(errors);
                }
            })
        }
    }).catch(error=>console.log(error));
}

exports.currentUser = (passport.authenticate('basic', { session: false }),
    (req, res)=>{
        res.json({msg:'Success'});
})