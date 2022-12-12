import express from "express";
import axios from "axios";
const app = express();
import * as fs from "fs";
const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.use(express.static("public"));

const Test: object[] = [];

const saveData = (data: any) => {
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const fetchData = async (i: number) => {
  const res = await axios(`https://swapi.dev/api/people/${i}`);
  if (res.status === 200) {
    return res.data;
  }
};

for (let i = 1; i < 83; i++) {
  fetchData(i)
    .then((res) => {
      Test.push(res);
      saveData(Test);
    })
    .catch((err) => {
      console.log(err);
    });
}

export default app;
