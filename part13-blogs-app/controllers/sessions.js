const router = require('express').Router();

const { Session } = require('../models');

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (error) {
    return res.status(400).json({ error })
  }
});

module.exports = router;
