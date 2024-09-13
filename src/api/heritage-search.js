// src/api/heritage-search.js
const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides coordinates for heritage places and cultural sites."
          },
          {
            role: "user",
            content: `Provide the name, latitude, and longitude of the heritage site or cultural location related to this query: ${query}. Format the response as a JSON object with 'name', 'lat', and 'lon' properties. Ensure 'lat' and 'lon' are numeric values.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const textResponse = response.data.choices[0].message.content;
    const place = JSON.parse(textResponse);

    if (place && typeof place.lat === 'number' && typeof place.lon === 'number') {
      return res.status(200).json({ place });
    } else {
      return res.status(500).json({ error: 'Invalid location data received.' });
    }
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    return res.status(500).json({ error: 'Error fetching data from OpenAI' });
  }
}
