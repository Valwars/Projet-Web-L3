import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";

function MapWithLoader({ user }) {
  const [isLoading, setIsLoading] = useState(true);

  const [dates, setDates] = useState([
    { adress: "68 rue de Bernis Albi", date: "resto", personne: "Valérie" },
    {adress: "57 St Juéry Albi", date: "resto", personne: "Marine" }
  ]);

  const [startCoordinates, setStartCoordinates] = useState({
    lat: null,
    lng: null,
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
                      stylers:[{visibility: "off"}]
                    },{
                      featureType: "poi.school",
                      stylers: [{visibility: "off"}]
                    },{
                      featureType: "transit",
                      stylers: [{visibility: "off"}]
                    }
                    ],

                  zoom: 13,
                });
                

                const marqer = new window.google.maps.Marker({
                  position: {
                    lat: startCoordinates.lat,
                    lng: startCoordinates.lng,
                  },
                  map: map,
                  title: "Mon adresse wesh",
                  icon: {
                    url: process.env.PUBLIC_URL + "https://xsgames.co/randomusers/avatar.php?g=male",
                    scaledSize: {
                      width: 80,
                      height: 80,
                    },
                  }
                  
                });
                let previousClickEvent;
                let previousDirectionsRenderer;
                const directionsService = new window.google.maps.DirectionsService();

                dates.forEach((date, index) => {
                  const geocoder = new window.google.maps.Geocoder();
                  geocoder.geocode(
                    { address: date.adress },
                    (results, status) => {
                      if (status === "OK") {
                        const infoWindowOptions = {
                          content: '<h3 class= "map_content">Date avec '+ date.personne +'</h3>'
                              + '<p class= "map_content_desc">Lieu:'+' '+'<a href="http://www.locronan-tourisme.com/" target="_blank">Macdo</a>'+'<br>Date: 16/12<br>Heure: 18h30 </p>'
                              + '<br/><img src="https://xsgames.co/randomusers/avatar.php?g=female" width="200px"/>'
                      };

                        const infoWindow = new window.google.maps.InfoWindow(infoWindowOptions);
                        const marker = new window.google.maps.Marker({
                          position: results[0].geometry.location,
                          map: map,
                          title: date.date,
                          clickable: false, // Désactiver l'effet de zoom au clic
                          label: "", // Supprimer les marqueurs A et B
                          optimized: false,
                          icon: {
                            url: process.env.PUBLIC_URL + "https://xsgames.co/randomusers/avatar.php?g=female",
                            scaledSize: {
                              width: 80,
                              height: 80,
                            },
                          }

                        });

                        window.google.maps.event.addListener(marker, 'click', function() {
                          // Supprimez l'événement de clic précédent
                          if (previousClickEvent) {
                            window.google.maps.event.removeListener(previousClickEvent);
                          }
                          // Supprimez le tracé de la destination cliquée précédemment
                          if (previousDirectionsRenderer) {
                            previousDirectionsRenderer.setMap(null);
                          }
                          
                          // Ajoutez le nouvel événement de clic
                          const directionsRenderer = new window.google.maps.DirectionsRenderer({
                            suppressMarkers: true,
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
                          
                          // Stockez la référence de l'événement de clic actuel
                          previousClickEvent = window.google.maps.event.addListener(marker, 'click', function() {
                          });
                          
                          // Stockez la référence du tracé de la destination cliquée actuellement
                          previousDirectionsRenderer = directionsRenderer;
                        });
                        window.google.maps.event.addListener(marker,'mouseover', function() {
                          infoWindow.open(map, marker);
                        });
                        window.google.maps.event.addListener(marker,'mouseout', function() {
                          infoWindow.close();
                        });
                        var myoverlay = new window.google.maps.OverlayView();
                        myoverlay.draw = function () {
                          this.getPanes().markerLayer.id = "myMarker";
                        };
                        myoverlay.setMap(map);
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
