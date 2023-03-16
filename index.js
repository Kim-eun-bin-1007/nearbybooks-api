const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());

app.get('/', (req, res) => {
  res.json({'test': 'test ing'});
});

app.listen(port, () => {
  console.log(`connect server on port ${port}`);
});