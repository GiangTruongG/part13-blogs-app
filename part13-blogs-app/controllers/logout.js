const router = require('express').Router();

const { Session } = require('../models');

const { tokenExtractor } = require('../util/middleware');

router.delete('/', tokenExtractor, async (req, res) => {
  const session = await Session.findOne({
    where: {
      token: req.token
    }
  })
  session.destroy();
  res.json("Logout is successful!");
});

module.exports = router;
