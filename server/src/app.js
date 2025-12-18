const express = require('express');
const cors = require('cors');

const recipesRouter = require('./routes/recipes');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Routes without /api prefix since they're served via /api rewrite
app.use('/recipes', recipesRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => res.send('Recipe API running'));

module.exports = app;
