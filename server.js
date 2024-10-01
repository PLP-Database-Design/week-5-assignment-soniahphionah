const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express()

// Database connection
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to th database
db.connect((err) => {
    if (err) {
        console.error('error connecting to the database:', err.message);
        return;
    }
    console.log('connected to the MySQL database');
});

// 1. Retrieve all patients
app.get('/patients', (req,res) => {
    const query = 'SELECT pSELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
});
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  });
  
  // 3. Filter patients by First Name
  app.get('/patients/search', (req, res) => {
    const { first_name } = req.query;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [first_name], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
  const { specialty } = req.query;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});


// listen to the server
const PORT = 3000
app.listen(PORT, () => {
    console.log('server is running on http://localhost:${PORT}');
});