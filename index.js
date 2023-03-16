const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.json({'test': 'test ing'});
});

app.listen(port, () => {
  console.log(`connect server on port ${port}`);
});