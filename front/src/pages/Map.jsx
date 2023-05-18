import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";
import Loader_transition from "../components/Loading";
import { getImage, datesRoute } from "../utils/APIRoutes";

function MapWithLoader({ user, isDark }) {
  const [startCoordinates, setStartCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [dates, setDates] = useState([]);

  const [leuser, setLeuser] = useState({});

  const [loading, setLoading] = useState(true);

  const [default_style, setDefault] = useState([
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
  ]);

  const [current_style, setCurrent] = useState(default_style);

  const [dark, setDark] = useState([
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
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ]);

  useEffect(() => {
    if (isDark) {
      setCurrent(dark);
    } else {
      setCurrent(default_style);
    }
  }, [isDark]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLeuser(user);
    console.log(leuser._id);
    var unid = leuser._id;
    try {
      const response = await axios.get(datesRoute, {
        params: {
          lid: user._id,
        },
      });
      console.log(response.data.dates);

      setDates(response.data.dates);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

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
      <div style={{ display: "flex", width: "100%" }}>
        {isLoading ? (
          <Loader_transition></Loader_transition>
        ) : (
          <div
            className="google_map"
            style={{ height: "100vh", width: "100%" }}
            ref={(mapContainer) => {
              if (mapContainer) {
                const map = new window.google.maps.Map(mapContainer, {
                  center: {
                    lat: startCoordinates.lat,
                    lng: startCoordinates.lng,
                  },
                  styles: current_style,

                  zoom: 14,
                });
                const marqer = new window.google.maps.Marker({
                  position: {
                    lat: startCoordinates.lat,
                    lng: startCoordinates.lng,
                  },
                  map: map,
                  title: "Mon adresse",
                  icon: {
                    url: getImage + user.pdp,
                    scaledSize: {
                      width: 80,
                      height: 80,
                    },
                  },
                });
                let previousClickEvent;
                let previousDirectionsRenderer;
                const directionsService =
                  new window.google.maps.DirectionsService();

                let params = new URLSearchParams(window.location.search);
                let id = params.get("id");

                dates.forEach((date, index) => {
                  const geocoder = new window.google.maps.Geocoder();
                  geocoder.geocode(
                    { address: date.localisation },
                    (results, status) => {
                      if (status === "OK") {
                        const infoWindowOptions = {
                          content:
                            '<div class="bubble_content"><div class="pdp"><img src="' +
                            getImage +
                            date.pdp +
                            '" /></div><div class="bubble_data"><h2>' +
                            date.firstname +
                            date.name +
                            "</h2><p>" +
                            date.localisation +
                            "</p><p>" +
                            date.date +
                            "</p></div></div>",
                        };

                        const infoWindow = new window.google.maps.InfoWindow(
                          infoWindowOptions
                        );
                        const marker = new window.google.maps.Marker({
                          position: results[0].geometry.location,
                          map: map,
                          clickable: true,
                          label: "", // Supprimer les marqueurs A et B
                          optimized: false,
                          icon: {
                            url: getImage + date.pdp,
                            scaledSize: {
                              width: 80,
                              height: 80,
                            },
                          },
                        });

                        window.google.maps.event.addListener(
                          marker,
                          "click",
                          function () {
                            console.log("1");
                            // Supprimez l'événement de clic précédent
                            if (previousClickEvent) {
                              window.google.maps.event.removeListener(
                                previousClickEvent
                              );
                            }
                            // Supprimez le tracé de la destination cliquée précédemment
                            if (previousDirectionsRenderer) {
                              previousDirectionsRenderer.setMap(null);
                            }

                            // Ajoutez le nouvel événement de clic
                            const directionsRenderer =
                              new window.google.maps.DirectionsRenderer({
                                suppressMarkers: true,
                                polylineOptions: {
                                  strokeColor: "#FF7A7A",
                                  strokeWeight: 6,
                                },
                              });
                            const request = {
                              origin: {
                                lat: startCoordinates.lat,
                                lng: startCoordinates.lng,
                              },
                              destination: results[0].geometry.location,
                              travelMode: "DRIVING",
                            };

                            directionsService.route(
                              request,
                              (result, status) => {
                                if (status === "OK") {
                                  directionsRenderer.setDirections(result);
                                }
                              }
                            );

                            directionsRenderer.setMap(map);

                            // Stockez la référence de l'événement de clic actuel
                            previousClickEvent =
                              window.google.maps.event.addListener(
                                marker,
                                "click",
                                function () {}
                              );

                            // Stockez la référence du tracé de la destination cliquée actuellement
                            previousDirectionsRenderer = directionsRenderer;
                          }
                        );
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
                        var myoverlay = new window.google.maps.OverlayView();
                        myoverlay.draw = function () {
                          this.getPanes().markerLayer.id = "myMarker";
                        };
                        myoverlay.setMap(map);
                        if (date._id === id) {
                          const marker1 = new window.google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            clickable: true,
                            label: "", // Supprimer les marqueurs A et B
                            optimized: false,
                            icon: {
                              url: getImage + date.pdp,
                              scaledSize: {
                                width: 80,
                                height: 80,
                              },
                            },
                          });

                          infoWindow.open(map, marker1);
                          const directionsRenderer =
                            new window.google.maps.DirectionsRenderer({
                              suppressMarkers: true,
                              polylineOptions: {
                                strokeColor: "#FF7A7A",
                                strokeWeight: 6,
                              },
                            });

                          const request = {
                            origin: {
                              lat: startCoordinates.lat,
                              lng: startCoordinates.lng,
                            },
                            destination: results[0].geometry.location,
                            travelMode: "DRIVING",
                          };

                          directionsService.route(request, (result, status) => {
                            if (status === "OK") {
                              directionsRenderer.setDirections(result);
                            }
                          });

                          directionsRenderer.setMap(map);
                        }
                      }
                    }
                  );
                });
              }
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default MapWithLoader;
