import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './App.scss';

// Custom marker icon for Leaflet
const customMarker = new L.Icon({
  iconUrl: '/marker-icon.png', // Points to the image in the public folder
  shadowUrl: '/marker-shadow.png', // Optional shadow image
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon that corresponds to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // Size of the shadow
});

// Search Bar Component
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter location or cultural site"
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

// Map Component
const Map = ({ heritagePlaces, center, onSearch }) => {
  function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
      map.invalidateSize(); // Fix for re-renders or size issues
    }, [center, map]);
    return null;
  }

  return (
    <MapContainer center={center} zoom={13} className="map-container">
      <ChangeView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Array.isArray(heritagePlaces) && heritagePlaces.length > 0 ? (
        heritagePlaces.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]} icon={customMarker}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))
      ) : (
        <p>No heritage places found.</p>
      )}
      <div className="search-overlay">
        <SearchBar onSearch={onSearch} />
      </div>
    </MapContainer>
  );
};

// Main App Component
const App = () => {
  const [heritagePlaces, setHeritagePlaces] = useState([]);
  const [center, setCenter] = useState([13.3409, 74.7421]); // Default center coordinates
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchHeritagePlaces = async (query) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/heritage-search', { query });
      const { place } = response.data;

      if (place && typeof place.lat === 'number' && typeof place.lon === 'number') {
        setCenter([place.lat, place.lon]);
        setHeritagePlaces([place]);
      } else {
        setError('Invalid location data received.');
      }
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Failed to fetch location data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Map heritagePlaces={heritagePlaces} center={center} onSearch={searchHeritagePlaces} />
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
      {error && <div className="error-overlay"><p>{error}</p></div>}
    </div>
  );
};

export default App;
