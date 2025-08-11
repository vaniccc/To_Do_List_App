const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.use((req, res) => {
  res.status(404);
  res.send(`<h1>Error 404: Resource not found!</h1>`);
})

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});