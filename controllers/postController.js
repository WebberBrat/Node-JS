const Post = require('../models/Post');

// Show all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts });
  } catch (err) {
    res.status(500).send('Error fetching posts');
  }
};

// Show create post page
exports.createPage = (req, res) => {
  res.render('create');
};

// Create a new post
exports.createPost = async (req, res) => {
  const { title, description, author } = req.body;
  try {
    const newPost = await Post.create({ title, description, author });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error creating post');
  }
};

// Show edit post page
exports.editPage = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    res.render('edit', { post });
  } catch (err) {
    res.status(500).send('Error fetching post for edit');
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, author } = req.body;
  try {
    await Post.findByIdAndUpdate(id, { title, description, author });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error updating post');
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting post');
  }
};
