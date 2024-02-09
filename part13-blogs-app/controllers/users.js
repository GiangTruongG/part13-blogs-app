const router = require('express').Router();

const { User, Blog, UserBlogs } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['author', 'url', 'title', 'likes']
    }
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    res.json(user);
  } catch (error) {
    // return res.status(400).json({ error });
    return res.status(400).json({ error: error?.errors[0]?.message });
  };
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user)
  } else {
    res.status(404).end()
  }
});

router.get('/:id', async (req, res) => {
  const queryOptions = {
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'read'] },
        include: [
          {
            model: User,
            attributes: ['name']
          },
          {
            model: UserBlogs,
            as: 'readinglists',
            attributes: ['id'],
            include: {
              model: Blog,
              attributes: ['read']
            }
          }
        ],
        through: {
          as: 'aaaaaa',
          attributes: [],
        },
      },
    ]
  }

  if (req.query.read) {
    console.log(req.query.read);
    queryOptions.include[0].where = {
      read: req.query.read
    };
  };

  const user = await User.findByPk(req.params.id, queryOptions);

  if (user) {
    res.json(user);
  } else {
    res.status(404).end()
  }
});

module.exports = router;
