const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA';

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&polygon=1&addressdetails=1`
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new HttpError(
        'Could not find location for the specified address.',
        422
    );
  }

  const result = {
    lat: data[0].lat,
    lng: data[0].lon
  }

  return result;
}

module.exports = getCoordsForAddress;
