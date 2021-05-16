/* GeoJSON - Earthquake Data */
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

d3.json(url).then(response => {
    
  console.log(response)

  const chooseColor = (feature) => {
    if (feature.geometry.coordinates[2] >= 90) {
      return '#ff0000';
    } else if (feature.geometry.coordinates[2] >= 70) {
      return '#ff5e00';
    } else if (feature.geometry.coordinates[2] >= 50) {
      return '#ffae00';
    } else if (feature.geometry.coordinates[2] >= 30) {
      return '#f6ff00';
    } else if (feature.geometry.coordinates[2] >= 10) {
      return '#bbff00';
    } else {
      return '#00ff0d';
    };
  };

  const geojsonMarkerOptions = (feature) => ({
      radius: feature.properties.mag * 2.5,
      fillColor: chooseColor(feature),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  });

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, geojsonMarkerOptions(feature))
  }

  const onEachFeature = (feature, layer) => {
    layer.bindPopup(`<h3>${feature.properties.title}</h3>
    <hr></hr>
    <p style='margin:0;'> <b>Place:</b> ${feature.properties.place}</p>
    <p style='margin:0;'> <b>Magnitude:</b> ${feature.properties.mag}</p>
    <p style='margin:0;'> <b>Time:</b> ${new Date(feature.properties.time)}</p>`);
  };

  const earthquakes = L.geoJSON(response, {
      pointToLayer: pointToLayer,
      onEachFeature: onEachFeature,
    });

  createMap(earthquakes);

})

/* Creating Leaflet / Mapbox Map */
const createMap = (earthquakes) => {

 // Define streetMap and darkMap, satelliteMap and outdoorsMap layers
 const streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

const darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

const satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-v9",
  accessToken: API_KEY
});

const outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "outdoors-v11",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
const baseMaps = {
  "Street Map": streetMap,
  "Dark Map": darkMap,
  "Satellite Map": satelliteMap,
  'Outdoors Map': outdoorsMap
};

// Create overlay object to hold our overlay layer
const overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
const myMap = L.map("mapid", {
  center: [34.052235, -118.243683],
  zoom: 8,
  layers: [streetMap, earthquakes]
});

// Create a layer control to pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


/* Legend Section */

// Create a legend to display information about our map
const legend = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function() {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<h6>Earthquake Depth</h6>';
  div.innerHTML += '<i style="background: #00ff0d"></i><span><10</span><br>';
  div.innerHTML += '<i style="background: #bbff00"></i><span>10 - 30</span><br>';
  div.innerHTML += '<i style="background: #f6ff00"></i><span>30 - 50</span><br>';
  div.innerHTML += '<i style="background: #ffae00"></i><span>50 - 70</span><br>';
  div.innerHTML += '<i style="background: #ff5e00"></i><span>70 - 90</span><br>';
  div.innerHTML += '<i style="background: #ff0000"></i><span>90+</span><br>';
  return div;
};
// Add the info legend to the map
legend.addTo(myMap);

}