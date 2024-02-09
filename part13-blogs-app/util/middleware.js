const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const { Session } = require('../models');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7));
      const session = await Session.findOne({
        where: {
          token: authorization.substring(7)
        }
      })

      if (session) {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        req.token = authorization.substring(7);
      } else {
        return res.status(401).json({ error: 'token expried' });
      };
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }

  next();
};

module.exports = { tokenExtractor }
