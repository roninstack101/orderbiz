import axios from "axios";

const GEOCODE_API_KEY = process.env.OPENCAGE_API_KEY; // Replace this with your real key

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: GEOCODE_API_KEY,
          q: address,
          limit: 1,
        },
      }
    );

    const result = response.data.results[0];
    if (!result) return null;

    const { lat, lng } = result.geometry;
    return {
      type: "Point",
      coordinates: [lng, lat],
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
};
