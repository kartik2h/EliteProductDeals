// server.js
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Elite'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Route to fetch all products
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Serve static files
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

/*
// Sample product data (replace with your actual data or connect to a database)
const products = [
    { id: 1, name: 'ring 1', description: ' of Product 1', price: 10 },
    { id: 2, name: 'teddy 2', description: 'Description of Product 2', price: 20 },
    { id: 3, name: 'rose 3', description: 'Description of Product 3', price: 30 },
    { id: 4, name: 'flowers 4', description: 'Description of Product 4', price: 40 },
    { id: 5, name: 'shirt 5', description: 'Description of Product 5', price: 50 },
    { id: 6, name: 'unicorn 6', description: 'Description of Product 6', price: 60 }
];

// Endpoint to get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
*/
