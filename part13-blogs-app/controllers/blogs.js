const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog, User } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
          [Op.substring]: req.query.search
          }
        },
        {
          author: {
          [Op.substring]: req.query.search
          }
        }
      ]
    }
  };

  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [['likes', 'DESC']]
    });
    res.json(blogs);
  } catch (error) {
    return res.status(400).json({ error })
  }
});

router.post('/', tokenExtractor, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, year: Number(req.body.year), userId: user.id });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error })
  }
});

router.delete('/:id', tokenExtractor, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    console.log(req.decodedToken.id, blog.userId);
    if (Number(req.decodedToken.id) === Number(blog.userId)) {
    blog.destroy();
    res.json("Blog is deleted successfully!");
    } else {
    res.status(400).json("Blog deleted unsuccessfully!");
    };
  } catch (error) {
    return res.status(400).json({ error })
  }
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  };
});

module.exports = router;
