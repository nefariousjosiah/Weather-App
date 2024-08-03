const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;

    if (!city) {
        return res.status(400).send('City is required');
    }

    try {
        const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            axios.get(currentWeatherURL),
            axios.get(forecastURL)
        ]);

        res.json({
            currentWeather: currentWeatherResponse.data,
            forecast: forecastResponse.data.list
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
