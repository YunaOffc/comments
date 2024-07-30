const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;

app.use(express.json());

const COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.get('/comments', (req, res) => {
    fs.readFile(COMMENTS_FILE, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading comments');
        }
        const comments = JSON.parse(data);
        res.json(comments);
    });
});

app.post('/comments', (req, res) => {
    const newComment = req.body;
    fs.readFile(COMMENTS_FILE, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading comments');
        }
        const comments = JSON.parse(data);
        comments.push(newComment);
        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), err => {
            if (err) {
                return res.status(500).send('Error saving comment');
            }
            res.status(201).send('Comment added');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Initial comments file setup
if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify([], null, 2));
}
