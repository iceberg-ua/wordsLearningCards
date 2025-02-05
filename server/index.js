const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const WORDS_FILE = './data/words.json';

// Create data directory and words.json if they don't exist
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}
if (!fs.existsSync(WORDS_FILE)) {
    fs.writeFileSync(WORDS_FILE, JSON.stringify([]));
}

app.get('/api/words', (req, res) => {
    const words = JSON.parse(fs.readFileSync(WORDS_FILE));
    res.json(words);
});

app.post('/api/words', (req, res) => {
    const { word, translation } = req.body;
    const words = JSON.parse(fs.readFileSync(WORDS_FILE));
    words.push({ id: Date.now(), word, translation });
    fs.writeFileSync(WORDS_FILE, JSON.stringify(words));
    res.json({ success: true });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
