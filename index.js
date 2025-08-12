const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const usersRoute = require('./routes/userRoutes');

app.use(express.static('public'))

app.use(express.json());

app.use('/userRoutes', usersRoute);

app.use((req, res) => {
  res.status(404);
  res.send(`<h1>Error 404: Resource not found!</h1>`);
})

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 
