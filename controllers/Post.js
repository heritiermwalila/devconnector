const mongoose = require('mongoose');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const PostValidation = require('../validator/post');


exports.createPost = (req, res)=>{

    const {errors, isValid} = PostValidation(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.name,
        user:req.user.id
    });

    newPost.save().then(post=> res.json(post))
}

exports.getAllPosts = (req, res)=>{

    Post.find().sort({date:-1}).then(posts=>{
         res.json(posts);
    }).catch(error=>res.status(400).json({noPostFound:'No post available'}));
}
exports.getPost = (req, res)=>{

    Post.findById({_id:req.params.id}).then(post=>{
         res.json(post);
    }).catch(error=>res.status(400).json({noPostFound:'No post was found with that id'}));
}

exports.deletePost = (req, res)=>{

    Profile.findOne({user:req.user.id}).then(profile=>{
        Post.findById({_id:req.params.id}).then(post=>{
            //the own of the post before deleting
            if(post.user.toString() !== req.user.id){
                return res.status(400).json({noAuthorized: 'User not authorized to delete post'});
            }

            //delete the post
            post.remove().then(()=>res.status(200).json({success:true}))
        }).catch(error=>res.status(400).json({noPostFound:'No post was found'}));
    })
    
}

exports.likePost = (req, res)=>{
    
    Profile.findOne({user:req.user.id}).then(profile=>{
        Post.findById({_id:req.params.id}).then(post=>{

            //check if the user already like the post
            if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
                return res.status(400).json({postLiked:'You\'re already liked this post'});
            }

            post.likes.unshift({user:req.user.id});
            post.save().then(post=>res.json(post));


        }).catch(error=>res.status(400).json({noPostFound:'No post was found'}));
    })
}
exports.unlikePost = (req, res)=>{
    
    Profile.findOne({user:req.user.id}).then(profile=>{
        Post.findById({_id:req.params.id}).then(post=>{

            //check if the user already like the post
            if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){
                return res.status(400).json({noLikes:'You cannot remove like which does not exist'});
            }

            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);
            post.save().then(post=> res.json(post));


        }).catch(error=>res.status(400).json({noPostFound:'No post was found'}));
    })
}

exports.commentPost = (req, res)=>{

    const {errors, isValid} = PostValidation(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    Post.findById({_id:req.params.id}).then(post=>{
        const newComment = {
            user:req.user.id,
            text:req.body.text,
            name:req.body.name,
            avatar:req.body.avatar
        }

        //add the new comment to the array 
        post.comments.unshift(newComment);

        //save the comment
        post.save().then(post=> res.json(post))
    }).catch(error=>res.status(404).json({noPostFound:'No post was found'}));
}

exports.deleteComment = (req, res)=>{
    Post.findById({_id:req.params.id}).then(post=>{

        //allow logged owner of the commment to delete the comment

        if(post.comments.filter(comment=>comment.user.toString() === req.user.id).length === 0){

           return res.status(404).json({noUserComment:'No User associate with this comment was found'});

        }else{

             //find the index of the comment
             if(post.comments.filter(item => item._id.toString()  === req.params.comment_id).length === 0){
                return res.status(400).json({noComment:'This comment does not exist'});
            }

            const commentIndex = post.comments.map(comment=>comment._id.toString()).indexOf(req.params.comment_id);

            post.comments.splice(commentIndex, 1);
            post.save().then(post=> res.json(post))

        }
        

        

    }).catch(error=>res.status(404).json({noPostFound:'No post was found'}));
}