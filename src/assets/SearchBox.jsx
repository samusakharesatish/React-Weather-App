import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBox.css"
import { useState } from 'react';

export default function SearchBox({ updateInfo }) {
    let [city, setCity] = useState("");
    const API_URL = import.meta.env.VITE_WEATHER_API_URL;
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    console.log("API_URL =", API_URL);
    console.log("API_KEY =", API_KEY);


    const getWeatherInfo = async () => {
         if (!API_URL || !API_KEY) {
      throw new Error("Missing API configuration");
    }
    
        const response = await fetch(
            `${API_URL}?q=${city.trim()},IN&appid=${API_KEY}&units=metric`
        );

        const jsonResponse = await response.json(); // ✅ DEFINED HERE
        console.log("API RESPONSE:", jsonResponse);

        if (jsonResponse.cod !== 200) {
            throw new Error(jsonResponse.message || "City not found");
        }

        return {
            city: jsonResponse.name,
            temp: jsonResponse.main.temp,
            tempMin: jsonResponse.main.temp_min,
            tempMax: jsonResponse.main.temp_max,
            humidity: jsonResponse.main.humidity,
            feelslike: jsonResponse.main.feels_like,
            weather: jsonResponse.weather[0].description,
        };
    };


    let handleChange = (event) => {
        setCity(event.target.value);

    };

    let handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // 1️⃣ fetch using CURRENT city
            const newInfo = await getWeatherInfo();

            // 2️⃣ update weather state
            updateInfo(newInfo);

            // 3️⃣ clear input AFTER update
            setCity("");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className='SearchBox'>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="city"
                    label="City Name"
                    variant="outlined"
                    value={city}
                    onChange={handleChange}
                    required />
                <br /><br />
                <Button
                    variant="outlined"
                    type='submit'>Search</Button>
            </form>
        </div>
    );
};