const express = require('express');
const supabaseClient = require('@supabase/supabase-js');

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));

const supabaseURL = "https://epyxrggyyuntjuaslbqr.supabase.co"
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweXhyZ2d5eXVudGp1YXNsYnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MDgzNjYsImV4cCI6MjA0ODQ4NDM2Nn0.FEjCK8niumZaWUg9mT2QUqFTJrBdgo8SqVOAHMJ5uOY'
const supabase = supabaseClient.createClient(supabaseURL, supabaseKey)

app.get('/Adopters', async (req, res) => {
    console.log('Attempting to get all adopters')

    const {data, error} = await supabase.from('Adopters').select('*')

    console.log("Data Retrieved: ", data)
    console.log("Error: ", error)
    
    res.send(data)
});

app.post('/Adopters', (req, res) => {
    console.log('Attempting to create a new adopter')
    res.send('Adopters')
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

