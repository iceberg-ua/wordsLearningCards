const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const LANGUAGES_FILE = path.join(DATA_DIR, 'languages.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Create languages.json if it doesn't exist
if (!fs.existsSync(LANGUAGES_FILE)) {
    fs.writeFileSync(LANGUAGES_FILE, JSON.stringify([]));
}

// Helper function to get/create language file
const getLanguageFile = (languageId) => {
    const filePath = path.join(DATA_DIR, `words_${languageId}.json`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    return filePath;
};

app.get('/api/languages', (req, res) => {
    const languages = JSON.parse(fs.readFileSync(LANGUAGES_FILE));
    res.json(languages);
});

app.post('/api/languages', (req, res) => {
    const { name } = req.body;
    const languages = JSON.parse(fs.readFileSync(LANGUAGES_FILE));
    const newLanguage = { 
        id: Date.now().toString(), 
        name 
    };
    languages.push(newLanguage);
    fs.writeFileSync(LANGUAGES_FILE, JSON.stringify(languages));
    
    // Create words file for new language
    getLanguageFile(newLanguage.id);
    
    res.json(newLanguage);
});

app.get('/api/words/:languageId', (req, res) => {
    const { languageId } = req.params;
    const filePath = getLanguageFile(languageId);
    const words = JSON.parse(fs.readFileSync(filePath));
    res.json(words);
});

app.post('/api/words/:languageId', (req, res) => {
    const { languageId } = req.params;
    const { word, translation } = req.body;
    const filePath = getLanguageFile(languageId);
    const words = JSON.parse(fs.readFileSync(filePath));
    words.push({ id: Date.now().toString(), word, translation });
    fs.writeFileSync(filePath, JSON.stringify(words));
    res.json({ success: true });
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});
