import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './App.scss';

// Custom marker icon for Leaflet
const customMarker = new L.Icon({
  iconUrl: '/marker-icon.png',  // Points to the image in the public folder
  shadowUrl: '/marker-shadow.png',  // Optional shadow image
  iconSize: [25, 41],  // Size of the icon
  iconAnchor: [12, 41],  // Point of the icon that corresponds to marker's location
  popupAnchor: [1, -34],  // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41],  // Size of the shadow
});

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
      {heritagePlaces.map((place, index) => (
        <Marker key={index} position={[place.lat, place.lon]} icon={customMarker}>
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
      <div className="search-overlay">
        <SearchBar onSearch={onSearch} />
      </div>
    </MapContainer>
  );
};

export default Map;
