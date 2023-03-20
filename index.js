const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch')
const app = express();
const port = 8080;

app.use(
  cors({ origin: ["https://nearbybooks.vercel.app", "http://localhost:3000"] })
);

app.get('/', (req, res) => {
  orderFetch(res);
});

app.listen(port, () => {
  console.log(`🥳 connect on port ${port}`);
});

// =====================================================

async function orderFetch(res) {
  const publicString = "SeoulPublicLibraryInfo";
  const smallString = "SeoulSmallLibraryInfo";

  const publicData = await getData(publicString);
  const smallData = await getData(smallString);

  const result = {
    total: { 'public': publicData.total, 'small': smallData.total },
    publicLibrary: publicData.library,
    smallLibrary: smallData.library,
  };

  res.json(result);
};

function getData(libraryString) {
  const api =
    "http://openapi.seoul.go.kr:8088/6c6b476c48646d73373141446f5962/json/";
  
  return fetch(`${api}${libraryString}/0/999`)
    .then((response) => response.json())
    .then((res) => {
      const total = res[libraryString].list_total_count;
      let data = res[libraryString].row;

      if (total >= 1000) {
        const turn = Math.ceil(total / 1000);
        const remainNum = total % 1000;

        for (let i = 2; i <= turn; i++) {
          const START_INDEX = 1000 * i - 1000;
          const END_INDEX = 1000 * i - 1;

          return fetch(`${api}${libraryString}/${START_INDEX}/${END_INDEX}/`)
            .then((response) => response.json())
            .then((res) => {
              if (i !== turn) {
                data.push(...res[libraryString].row);
              } else if (i === turn) {
                // 마지막 반복문 실행시
                if (remainNum !== 0) {
                  data.push(...res[libraryString].row);
                }

                return { total, library: classifyData(data) };
              }
            })
            .catch((err) => console.log(`🚩 ${err}`));
        }
      } else {
        return { total, library: classifyData(data) };
      }
    })
    .catch((err) => console.log(`⛔️ ${err}`));
};

function classifyData(data) {
  let separateData = {};

  data.forEach(item => {
    if (separateData[item.GU_CODE]) {
      separateData[item.GU_CODE].push(item);
    } else {
      const newGuCode = { [item.GU_CODE]: [item] };
      separateData = { ...separateData, ...newGuCode };
    }
  });

  return separateData;
}