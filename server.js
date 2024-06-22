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