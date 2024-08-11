const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.use(express.json());

// 클라이언트에서 POST 요청을 받아 파일에 텍스트 추가
app.post('/addSentence', (req, res) => {
  const sentence = req.body.sentence;
  if (sentence) {
    // 파일에 텍스트를 추가
    fs.appendFile('sentences.txt', sentence + '\n', (err) => {
      if (err) {
        console.error('파일에 텍스트를 추가하는 중 오류가 발생했습니다.', err);
        res.sendStatus(500);
      } else {
        console.log('파일에 텍스트가 추가되었습니다.');
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
