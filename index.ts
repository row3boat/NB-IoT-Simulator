let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;
import WebSocket from "isomorphic-ws";


function initMap(): void {

  /**
   * WEBSOCKET CONNECTION SENDS CONSTANT COORDINATES INCREASING SO AS TO ESSENTIALLY BE A VECTOR MOVING NORTH-EAST
   */
  const coords = [37.4419,-122.1430];
  var address;
  const ws = new WebSocket('wss://websocket-echo.com/');

  ws.onopen = async function open() {
    console.log('connected');
    ws.send(JSON.stringify(coords));
  };

  ws.onclose = function close() {
    console.log('disconnected');
  };


  /**
   * DEFAULT GOOGLE API CODE
   */
  var loc = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();

  ws.onmessage = function incoming(data) {
    console.log(data.data);

    setTimeout(function timeout() {
      coords[0] += 0.005;
      coords[1] -= 0.005;

      //TODO: USE GOOGLE GEOCODING TO TURN COORDS ARRAY INTO A STRING OF A PLACE VALUE, THEN SEND IT USING WS.SEND
      //
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords[0]},${coords[1]}&key=AIzaSyC4PWmV-wIsONQSz81Q2HfdAyjVTnVDDHc`)
          .then(response => response.json() )
          .then(data => {
            ws.send(data.results[0].formatted_address);
            address = data;
          })
          .catch(err => console.warn(err.message));

      loc = new google.maps.LatLng(coords[0],coords[1]);
      map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: loc,
        zoom: 14,
      });

    }, 5000);
  };



  var request = {
    query: address,
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(
      request,
      (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }

          map.setCenter(results[0].geometry!.location!);
        }
      }
  );
}

function createMarker(place: google.maps.places.PlaceResult) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};

