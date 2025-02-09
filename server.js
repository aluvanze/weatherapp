const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express(); // ✅ Define app before using it
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Check if API Key exists
if (!API_KEY) {
    console.error("❌ Missing API Key! Add OPENWEATHER_API_KEY to your .env file.");
    process.exit(1);
}

// ✅ Serve static files AFTER defining app
app.use(express.static('public'));

// Weather API route
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }
    
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        if (response.data.cod !== 200) {
            return res.status(response.data.cod).json({ error: response.data.message });
        }

        const { temp, humidity } = response.data.main;
        const weather = response.data.weather[0].description;

        res.json({ city, temperature: temp, humidity, weather });
    } catch (error) {
        console.error("❌ Error fetching weather data:", error.response?.data || error.message);
        res.status(500).json({ error: 'Could not fetch weather data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
