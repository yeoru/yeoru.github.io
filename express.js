const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/addSentence', (req, res) => {
  const sentence = req.body.sentence;
  if (!sentence) {
    return res.status(400).send('Sentence is required');
  }

  fs.appendFile('sentences.txt', sentence + '\n', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving the sentence.');
    }
    res.status(200).send('Sentence added successfully');
  });
});

app.get('/getSentences', (req, res) => {
  fs.readFile('sentences.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading sentences.');
    }
    const sentences = data.split('\n').filter(Boolean);
    res.json(sentences);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});