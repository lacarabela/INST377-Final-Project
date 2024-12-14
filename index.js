const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Default route - serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

// Route for Explore page
app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Explore.html'));
});

// Route for Adopt Now page
app.get('/adopt-now', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Adopt-Now.html'));
});

// Route for Newsletter page
app.get('/newsletter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Newsletter.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'Home.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
