const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Отримати всі пости
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts });
  } catch (error) {
    res.json({ error: 'Failed to fetch posts' });
  }
});

// Переглянути конкретний пост
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('post', { post });
  } catch (error) {
    res.json({ error: 'Failed to fetch post' });
  }
});

// Редагувати пост (буде використовуватися на окремій сторінці редагування)
router.get('/edit/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('edit', { post });
  } catch (error) {
    res.json({ error: 'Failed to fetch post for editing' });
  }
});

module.exports = router;
