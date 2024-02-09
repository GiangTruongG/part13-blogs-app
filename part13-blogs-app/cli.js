require('dotenv').config();
const express = require('express');
require('express-async-errors');
const { PORT } = require('./util/config');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { connectToDatabase } = require('./util/db');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const readingListRouter = require('./controllers/reading_list');
const sessionsRouter = require('./controllers/sessions');
const logoutRouter = require('./controllers/logout');

app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use('/api/authors', authorsRouter);

app.use('/api/users', usersRouter);

app.use('/api/login', loginRouter);

app.use('/api/readinglists', readingListRouter);

app.use('/api/sessions', sessionsRouter);

app.use('/api/logout', logoutRouter);

const start = async () => {
 await connectToDatabase();
 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 });
};

start();
