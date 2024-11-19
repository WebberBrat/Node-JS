const express = require('express');
const mongoose = require('mongoose');
const DBUrl = 'mongodb+srv://vlmelykh:pRctsugVbF0E1NM3@vlmelykh.hjp1t.mongodb.net/ '
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const bodyParser = require('body-parser');
const Post = require('./models/Post');  // Модель поста
const User = require('./models/User');  // Модель користувача
const app = express();
const PORT = 3000;

// Підключення до MongoDB
mongoose.connect(DBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Налаштування EJS як шаблонного движка
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Тіло запитів
app.use(bodyParser.urlencoded({ extended: true }));

// Сесії для збереження інформації про користувача
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


// Ініціалізація passport
app.use(passport.initialize());
app.use(passport.session());

// Стратегія для passport (локальна стратегія)
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Сесія користувача (після успішного входу)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Десеріалізація користувача з сесії
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// Статичні файли (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Тіло запитів
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрут для головної сторінки з переліком постів
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find(); // Отримуємо всі пости
    res.render('index', { posts, user: req.user  }); // Рендеримо шаблон 'index' з передачею постів
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
  res.render('create', {user: req.user});
});

// Маршрут для обробки форми створення поста
app.post('/create', async (req, res) => {
  const { title, description, author } = req.body;
  try {
    const newPost = new Post({ title, description, author : req.user });
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

app.get('/login', (req, res) => {
  res.render('login');
});

// Обробка форми входу
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Маршрут для реєстрації
app.get('/register', (req, res) => {
  res.render('register');
});

// Обробка форми реєстрації
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

// Вихід з системи
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Стартуємо сервер
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
