const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch')
const app = express();
const port = 8080;

function getData() {
  const api =
    "http://openapi.seoul.go.kr:8088/6c6b476c48646d73373141446f5962/json/";
  const publicString = "SeoulPublicLibraryInfo";
  const smallString = "SeoulSmallLibraryInfo";

  return fetch(`${api}${publicString}/0/999`)
    .then(response => response.json())
    .then(res => {
      const total = res[publicString].list_total_count;
      const data = res[publicString].row;
      return data;
    })
    .catch(err => err);
};

app.use(cors());

app.get('/', (req, res) => {
  getData().then(response => {
    res.json(response);
  })
});

app.listen(port, () => {
  console.log(`🥳 connect on port ${port}`);
});