import axios from 'axios';

export const geocodeAddress = async (address) => {
  const apiKey = process.env.OPENCAGE_API_KEY;

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error('No results found for address');
    }
  } catch (error) {
    console.error('Geocoding failed:', error.message);
    return null;
  }
};
