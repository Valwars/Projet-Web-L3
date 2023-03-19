import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";

function MapWithLoader({ user }) {
  const [isLoading, setIsLoading] = useState(true);

  const [dates, setDates] = useState([
    { adress: "68 rue de Bernis Albi", date: "resto", personne: "Valérie" },
    { adress: "57 St Juéry Albi", date: "resto", personne: "Marine" },
  ]);

  const [startCoordinates, setStartCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const [endCoordinates, setEndCoordinates] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs",
      version: "weekly",
    });

    loader.load().then(() => {
      fetch_data();
    });
  }, []);

  const fetch_data = async () => {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: user.localisation,
          key: "AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs",
        },
      }
    );
    const { lat, lng } = response.data.results[0].geometry.location;
    setStartCoordinates({ lat, lng });
    setIsLoading(false);
  };

  return (
    <div className="app-page">
      <div>
        {isLoading ? (
          <p>Loading map...</p>
        ) : (
          <div
            style={{ height: "100vh", width: "100%" }}
            ref={(mapContainer) => {
              if (mapContainer) {
                const map = new window.google.maps.Map(mapContainer, {
                  center: {
                    lat: startCoordinates.lat,
                    lng: startCoordinates.lng,
                  },
                  styles: [
                    {
                      featureType: "poi",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "poi.school",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "transit",
                      stylers: [{ visibility: "off" }],
                    },
                  ],

                  zoom: 14,
                });

                const marqer = new window.google.maps.Marker({
                  position: {
                    lat: startCoordinates.lat,
                    lng: startCoordinates.lng,
                  },
                  map: map,
                  title: "Mon adresse wesh",
                  icon: {
                    url: "https://xsgames.co/randomusers/avatar.php?g=male",
                    scaledSize: {
                      width: 80,
                      height: 80,
                    },
                  },
                  shape: {
                    coords: [10, 10, 10],
                    type: "circle",
                  },
                });

                dates.map((date, index) => {
                  const geocoder = new window.google.maps.Geocoder();
                  geocoder.geocode(
                    { address: date.adress },
                    (results, status) => {
                      if (status === "OK") {
                        const infoWindowOptions = {
                          content:
                            '<h3 class= "map_content">Date avec ' +
                            date.personne +
                            "</h3>" +
                            '<p class= "map_content_desc">Lieu:' +
                            " " +
                            '<a href="http://www.locronan-tourisme.com/" target="_blank">Macdo</a>' +
                            "<br>Date: 16/12<br>Heure: 18h30 </p>" +
                            '<br/><img src="https://xsgames.co/randomusers/avatar.php?g=female" width="200px" />',
                        };
                        const infoWindow = new window.google.maps.InfoWindow(
                          infoWindowOptions
                        );

                        const marker = new window.google.maps.Marker({
                          position: results[0].geometry.location,
                          map: map,
                          title: date.date,
                          optimized: false,

                          icon: {
                            url: "https://xsgames.co/randomusers/avatar.php?g=female",
                            scaledSize: {
                              width: 80,
                              height: 80,
                            },
                          },
                        });

                        window.google.maps.event.addListener(
                          marker,
                          "mouseover",
                          function () {
                            infoWindow.open(map, marker);
                          }
                        );
                        window.google.maps.event.addListener(
                          marker,
                          "mouseout",
                          function () {
                            infoWindow.close();
                          }
                        );
                      }
                    }
                  );
                });

                const directionsService =
                  new window.google.maps.DirectionsService();
                const directionsRenderer =
                  new window.google.maps.DirectionsRenderer();

                const request = {
                  origin: {
                    lat: startCoordinates.lat,
                    lng: startCoordinates.lng,
                  },
                  destination: {
                    lat: endCoordinates.lat,
                    lng: endCoordinates.lng,
                  },
                  travelMode: "DRIVING",
                };

                directionsService.route(request, (result, status) => {
                  if (status === "OK") {
                    directionsRenderer.setDirections(result);
                  }
                });

                directionsRenderer.setMap(map);
                var myoverlay = new window.google.maps.OverlayView();
                myoverlay.draw = function () {
                  this.getPanes().markerLayer.id = "myMarker";
                };
                myoverlay.setMap(map);
              }
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default MapWithLoader;
