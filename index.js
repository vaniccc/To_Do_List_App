const express = require('express');
const usersRoute = require('./routes/userRoutes');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const todoRoute = require('./routes/todoRoutes');

app.use(express.static('public'))

app.use(express.json());

app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false,  maxAge: 24 * 60 * 60 * 1000}
}));

app.use('/users', usersRoute);

app.use('/todos', todoRoute);

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 
