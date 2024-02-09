const router = require('express').Router();

const { UserBlogs, User, Blog } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.post('/', async (req, res) => {
  try {
    const user_blogs = await UserBlogs.create({ ...req.body });
    res.json(user_blogs);
  } catch (error) {
    return res.status(400).json({ error });
    // return res.status(400).json({ error: error?.errors[0]?.message });
  };
});

router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    if (Number(req.params.id) === Number(req.decodedToken.id)) {
      const blog = await Blog.findByPk(req.params.id);
      const user = await User.findByPk(req.decodedToken.id);

      if (Number(user.id) === Number(blog.userId)) {
        blog.read = req.body.read;
        await blog.save();
      }
      
      res.json(blog);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
