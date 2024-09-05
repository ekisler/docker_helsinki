const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const redis = require('./redis');

const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');
const statisticsRouter = require('./routes/statics');

const app = express();

app.use((req, res, next) => {
    const response = res.get('Content-Type') === 'application/json' 
      ? JSON.parse(res.text) 
      : {};
    console.log('Response:', response);
    next();
  });

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/todos', todosRouter);
app.use("/statics", statisticsRouter)

module.exports = app;
