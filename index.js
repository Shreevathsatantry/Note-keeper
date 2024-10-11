const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error('Error reading directory:', err);
            res.render("index", { files: [] }); // Send an empty array to the view
            return;
        }
        res.render("index", { files: files });
    });
});

app.post('/create', function(req, res) {
    // Use proper filename handling
    const filename = `${req.body.title.split(' ').join('')}.txt`;
    fs.writeFile(`./files/${filename}`, req.body.details, function(err) {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('An error occurred while saving the file.');
            return;
        }
        res.redirect("/");
    });
});

// Corrected GET route for reading a file
app.get('/file/:filename', function(req, res) {
    const filePath = `./files/${req.params.filename}`; // No .txt extension here
    
    // Read the file and handle the result
    fs.readFile(filePath, 'utf-8', function(err, data) {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
        }
        res.render('show', { filename: req.params.filename, content: data });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
