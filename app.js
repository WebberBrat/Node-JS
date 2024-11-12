const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Post = require('./models/Post');  // Модель поста
const app = express();
const PORT = 3000;

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/posts', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Налаштування EJS як шаблонного движка
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Статичні файли (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Тіло запитів
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрут для головної сторінки з переліком постів
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find(); // Отримуємо всі пости
    res.render('index', { posts }); // Рендеримо шаблон 'index' з передачею постів
  } catch (err) {
    res.status(500).send("Failed to fetch posts");
  }
});

// Маршрут для перегляду окремого поста
app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);  // Знайти пост за ID
    res.render('post', { post });
  } catch (err) {
    res.status(404).send("Post not found");
  }
});

// Маршрут для створення нового поста
app.get('/create', (req, res) => {
  res.render('create');
});

// Маршрут для обробки форми створення поста
app.post('/create', async (req, res) => {
  const { title, description, author } = req.body;
  try {
    const newPost = new Post({ title, description, author });
    await newPost.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error creating post");
  }
});

// Маршрут для редагування поста
app.get('/edit/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('edit', { post });
  } catch (err) {
    res.status(404).send("Post not found");
  }
});

// Маршрут для оновлення поста
app.post('/edit/:id', async (req, res) => {
  const { title, description, author } = req.body;
  try {
    await Post.findByIdAndUpdate(req.params.id, { title, description, author });
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error updating post");
  }
});

// Маршрут для видалення поста
app.get('/delete/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error deleting post");
  }
});

// Стартуємо сервер
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
