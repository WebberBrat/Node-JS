const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

// Routes
router.get('/', postController.getAllPosts);            // View all posts
router.get('/create', postController.createPage);       // Create post page
router.post('/create', postController.createPost);      // Submit new post
router.get('/edit/:id', postController.editPage);       // Edit post page
router.post('/edit/:id', postController.updatePost);    // Update post
router.get('/delete/:id', postController.deletePost);   // Delete post

module.exports = router;
