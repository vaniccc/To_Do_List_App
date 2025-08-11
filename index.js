const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.send('To-Do-List App läuft! Test 1 erfolgreich abgeschlossen');
// });

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});