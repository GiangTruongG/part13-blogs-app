const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'articles'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    raw: true
  });

  const formattedAuthors = authors.map(item => ({
    author: item.author,
    articles: item.articles.toString(),
    likes: item.likes.toString(),
  }));

  res.json(formattedAuthors);
});

module.exports = router;
