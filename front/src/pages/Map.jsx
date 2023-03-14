import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';

function MapWithLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [startCoordinates, setStartCoordinates] = useState({ lat: null, lng: null });
  const [endCoordinates, setEndCoordinates] = useState({ lat: 37.7749, lng: -122.4194 });

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs',
      version: 'weekly',
    });

    loader.load().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleStartAddressChange = async (event) => {
    const address = event.target.value;
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: 'AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs',
      },
    });
    const { lat, lng } = response.data.results[0].geometry.location;
    setStartCoordinates({ lat, lng });
  };

  const handleEndAddressChange = async (event) => {
    const address = event.target.value;
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: 'AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs',
      },
    });
    const { lat, lng } = response.data.results[0].geometry.location;
    setEndCoordinates({ lat, lng });
  };

  return (
    <div className='app-page'>
      <div>
        <label>
          Start Address:
          <input type="text" onChange={handleStartAddressChange} />
        </label>
        <label>
          End Address:
          <input type="text" onChange={handleEndAddressChange} />
        </label>
        {isLoading ? (
          <p>Loading map...</p>
        ) : (
          <div
            style={{ height: '400px', width: '100%' }}
            ref={(mapContainer) => {
              if (mapContainer) {
                const map = new window.google.maps.Map(mapContainer, {
                  center: { lat: startCoordinates.lat, lng: startCoordinates.lng },
                  zoom: 12,
                });
                new window.google.maps.Marker({
                  position: { lat: startCoordinates.lat, lng: startCoordinates.lng },
                  map: map,
                });

                const directionsService = new window.google.maps.DirectionsService();
                const directionsRenderer = new window.google.maps.DirectionsRenderer();

                const request = {
                  origin: { lat: startCoordinates.lat, lng: startCoordinates.lng },
                  destination: { lat: endCoordinates.lat, lng: endCoordinates.lng },
                  travelMode: 'DRIVING',
                };

                directionsService.route(request, (result, status) => {
                  if (status === 'OK') {
                    directionsRenderer.setDirections(result);
                  }
                });

                directionsRenderer.setMap(map);
              }
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default MapWithLoader;
