// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid'); 

const PORT = 3001; // Define the port

const app = express(); // Create an Express.js server

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.static('public')); // Middleware to serve static files from '/public'