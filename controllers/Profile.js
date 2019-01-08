const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const User = require('../models/User');
const validateProfileInput = require('../validator/profile');
const validateExperienceInput = require('../validator/experiences');
const validatorEducationInput = require('../validator/educations');




exports.test = (req, res)=>{
     res.json('Profile works');
}


exports.loggedInUser = (req, res)=>{
     const errors = {};

     Profile.findOne({user:req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile=>{
            console.log(profile)
            if(!profile){
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors);
            }

             res.json(profile);
        }).catch(error=>{
            res.status(404).json(error);
        })
}

exports.createProfile = (req, res)=>{

    const {errors, isValid} = validateProfileInput(req.body);

    if(!isValid){
        //return error with a status of 400
        res.status(400).json(errors);
    }
    //get profile fields from the form
    const profileFields = {};
    

    //get logged in user
    profileFields.user = req.user.id;

    //check from key
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.gitusername) profileFields.gitusername = req.body.gitusername;

    //striong to array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }
    if(req.body.bio) profileFields.bio = req.body.bio;
    
    //social array
    profileFields.socials = {}
    if(req.body.youtube) profileFields.socials.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.socials.facebook = req.body.facebook;
    if(req.body.twitter) profileFields.socials.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.socials.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.socials.instagram = req.body.instagram;
    if(req.body.googleplus) profileFields.socials.googleplus = req.body.googleplus;

    Profile.findOne({user:req.user.id}).then(profile=>{
        if(profile){
            //update user profile
            Profile.findOneAndUpdate(
                {user:req.user.id}, 
                {$set:profileFields}, 
                {new:true}
                ).then(profile=> res.json(profile))
        }else{
            //create a profile
            /**
             * Check if the handle exist
             */

            Profile.findOne({handle: profileFields.handle}).then(profile=>{
                if(profile){
                    errors.handle = 'That handle already exist';
                    return res.status(400).json(errors);
                }

                //save profile
                new Profile(profileFields).save().then(profile=> res.json(profile))
            })
            
        }
    })

    
}

exports.getUserByHandle = (req, res)=>{
    const errors = {};
    Profile.findOne({handle:req.params.handle}).populate('user', ['name', 'avatar']).then(profile=>{
        if(!profile){
            errors.nohandle = 'No profile for this user';
            res.status(404).json(errors);
        }
         res.json(profile);
    }).catch(error=>res.status(404).json(erro))
}

exports.getuserById = (req, res)=>{
    const errors = {};
    Profile.findOne({user:req.params.user_id}).populate('user', ['name', 'avatar']).then(profile=>{
        if(!profile){
            errors.noprofile = 'There is no user with that ID';
            return res.status(404).json(errors);
        }
        res.json(profile)
    }).catch(error=>res.status(400).json(errors.noprofile))

}

exports.getAllProfile = (req, res)=>{
    Profile.find({}).populate('user', ['name', 'avatar']).then(profiles=> {
        if(!profiles){
            return res.status(404).json({noprofile:'No avalaible profile'})
        }
        res.json(profiles)
    }).catch(error=>res.status(400).json({noprofile:'No avalaible profile'}))
}

exports.userExperience = (req, res)=>{

    const {errors, isValid} = validateExperienceInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    //find a logged in user
    Profile.findOne({user:req.user.id}).then(profile=>{
        const newExp = {
            title:req.body.title,
            company:req.body.company,
            location:req.body.location,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            description:req.body.description
        };

        profile.experiences.unshift(newExp);
        profile.save().then(experiences=> res.json(experiences));

    }).catch(error=>res.status(400).json(error))
}


exports.userEducation = (req, res)=>{
    const {errors, isValid} = validatorEducationInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    Profile.findOne({user:req.user.id}).then(profile=>{
        const newEducation = {
            school:req.body.school,
            degree:req.body.degree,
            fieldOfStudy:req.body.fieldOfStudy,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            description:req.body.description
        }

        profile.educations.unshift(newEducation);
        profile.save().then(education=> res.json(education))
    }).catch(error=>res.status(400).json(error))
}

exports.deleteExperience = (req, res)=>{

    const IndexEl = req.params.id;
    Profile.findOne({user:req.user.id}).then(profile=>{

        //get experience
        const   experienceIndex = profile.experiences.map(item=>item.id).indexOf(IndexEl);
                profile.experiences.splice(experienceIndex, 1);

        //save
        profile.save().then(profile=> res.json(profile))
    })
}

exports.deletEducation = (req, res)=>{
    const indexEl = req.params.id;

    Profile.findOne({user:req.user.id}).then(profile=>{
        
        const educIndex = profile.educations.map(item=>item.id).indexOf(indexEl);
            profile.experiences.splice(educIndex, 1);

            profile.save().then(profile=> res.json(profile));
    })
}

exports.userProfileDelete = (req, res)=>{
    Profile.findOneAndRemove({user:req.user.id}).then(()=>{
        User.findByIdAndRemove({_id:req.user.id}).then(()=>{
             res.json({success:true});
        })
    }).catch(err=> res.json(err))
}