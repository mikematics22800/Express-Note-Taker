// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid'); 

const PORT = 3001; // Define the port

const app = express(); // Create an Express.js server

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.static('public')); // Middleware to serve static files from '/public'

// Serve notes.html to /notes
app.get('/notes', (req, res) => 
  res.sendFile(path.join(__dirname, 'public/notes.html')
));

// Send notes in response to get requests to /api/notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'notes.json'), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
})

// Serve index.html to all other routes
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, 'public/index.html')
));

// Add note in response to post requests to /api/notes
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uniqid() }; // Add a unique ID to the new note
  fs.readFile(path.join(__dirname, 'notes.json'), (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    db.push(newNote); // Add the new note to the array
    fs.writeFile(path.join(__dirname, 'notes.json'), JSON.stringify(db, null, 2), (err) => {
      if (err) throw err;
      res.json(newNote); // Send the new note back to the client
    });
  });
});

// Delete note with id in response to delete requests to /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id; 
  fs.readFile(path.join(__dirname, 'notes.json'), (err, data) => {
    if (err) throw err;0
    const db = JSON.parse(data);
    const filteredDb = db.filter(note => note.id !== id); // Filter out the note with the specified ID
    fs.writeFile(path.join(__dirname, 'notes.json'), JSON.stringify(filteredDb, null, 2), (err) => {
      if (err) throw err;
      res.json({ id }); // Send the ID back to the client
    });
  });
})

// Listen on the specified port
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));