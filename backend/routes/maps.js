// backend/routes/maps.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function geocode(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json`;
  const response = await axios.get(url, {
    params: { address, key: GOOGLE_MAPS_API_KEY }
  });
  const loc = response.data.results[0]?.geometry.location;
  if (!loc) throw new Error('Geocoding failed');
  return { latitude: loc.lat, longitude: loc.lng };
}

router.get('/directions', async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'from and to are required' });

    // Geocode both endpoints
    const [fromLoc, toLoc] = await Promise.all([
      geocode(from),
      geocode(to)
    ]);

    // Directions API call
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json`;
    const dirResp = await axios.get(directionsUrl, {
      params: {
        origin: `${fromLoc.latitude},${fromLoc.longitude}`,
        destination: `${toLoc.latitude},${toLoc.longitude}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (!dirResp.data.routes[0]) return res.status(404).json({ error: 'Route not found' });

    // Extract polyline
    const points = dirResp.data.routes[0].overview_polyline.points;
    const routeCoordinates = decodePolyline(points);

    return res.json({
      fromLocation: fromLoc,
      toLocation: toLoc,
      routeCoordinates
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Polyline decoder function
function decodePolyline(encoded) {
  // Algorithm from https://github.com/mapbox/polyline
  let points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

module.exports = router;
