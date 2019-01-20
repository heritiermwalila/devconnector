const express = require('express');
const router = express.Router();
const passport = require('passport');
const PostController = require('../../controllers/Post');


router.get('/test', (req, res)=>{
     res.json({msg:'Posts works'});
})

/**
 * REQUEST POST METHOD : /api/posts/create
 * @description This route is to create a new post by the signed in user
 * @access private
 */

 router.post('/', passport.authenticate('jwt', { session:false }), PostController.createPost);
/**
 * REQUEST POST METHOD : /api/posts/all
 * @description This route is to create a new post by the signed in user
 * @access private
 */

 router.get('/', passport.authenticate('jwt', { session:false }), PostController.getAllPosts);
/**
 * REQUEST GET METHOD : /api/posts/id
 * @description This route is to create a new post by the signed in user
 * @access private
 */

 router.get('/:id', passport.authenticate('jwt', { session:false }), PostController.getPost);
/**
 * REQUEST DELETE METHOD : /api/posts/id
 * @description This route is to create a new post by the signed in user
 * @access private
 */

 router.delete('/:id', passport.authenticate('jwt', { session:false }), PostController.deletePost);
/**
 * REQUEST POST METHOD : /api/posts/like/id
 * @description This route is to create a new post by the signed in user
 * @access private
 */

 router.post('/like/:id', passport.authenticate('jwt', { session:false }), PostController.likePost);
/**
 * REQUEST POST METHOD : /api/posts/unlike/id
 * @description This route is Unlike a post
 * @access private
 */

 router.post('/unlike/:id', passport.authenticate('jwt', { session:false }), PostController.unlikePost);
/**
 * REQUEST POST METHOD : /api/posts/comments/id
 * @description This route is to make a comment on the post
 * @access private
 */

 router.post('/comment/:id', passport.authenticate('jwt', { session:false }), PostController.commentPost);
/**
 * REQUEST DELETE METHOD : /api/posts/comments/id
 * @description This route is delete a comment from the post
 * @access private
 */

 router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session:false }), PostController.deleteComment);

module.exports = router