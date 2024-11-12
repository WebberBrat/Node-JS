const mongoose = require('mongoose');

// Схема поста
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true }
});

// Модель для поста
module.exports = mongoose.model('Post', postSchema);
