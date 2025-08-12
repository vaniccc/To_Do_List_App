const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const usersRoute = require('./routes/userRoutes');
const session = require('express-session');

app.use(express.static('public'))

app.use(express.json());

app.use('/users', usersRoute);

app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false,  maxAge: 24 * 60 * 60 * 1000}
}));

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 
