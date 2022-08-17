// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function Color(mag) {
  return mag > 6.0 ? '#800026' :
         mag > 5.5 ? '#BD0026' :
         mag > 5.0 ? '#E31A1C' :
         mag > 4.5 ? '#FC4E2A' :
         mag > 4.0 ? '#FD8D3C' :
         mag > 3.5 ? '#FEB24C' :
         mag > 3.0 ? '#FED976' :
                     '#FFEDA0';
}

function circleRadius(mag) {
return Math.sqrt(mag) * 5.5;
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: (feature, layer) => {
      return layer.bindPopup(`<h3> ${feature.properties.place} </h3><hr><p> ${new Date(feature.properties.time)} </p><hr><p> Magnitude: ${feature.properties.mag} </p>`);
    },

    pointToLayer: (feature, latlng) => {
      var markerOptions = {
        radius: circleRadius(feature.properties.mag),
        fillColor: Color(feature.properties.mag),
        color: "#000",
        weight: .5,
        opacity: 1,
        fillOpacity: .7
      };      
      return L.circleMarker(latlng, markerOptions);
    }
  });
  createMap(earthquakes);
} 

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the arra


  // Sending our earthquakes layer to the createMap function

function createMap(earthquakes) {

  // Define variables for our tile layers
  var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
  
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v9",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v9",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Greyscale": light,
    "Outdoors": outdoors,
    "Satellite ": satellite 
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map('map', {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [light, earthquakes]
  });

var legend = L.control({position: 'bottomright'});

legend.onAdd = map => {
      div = L.DomUtil.create('div', 'info legend'),
      mags = [2.5, 3, 3.5, 4, 4.5, 5, 5.5],
      labels = [];
    
  for (var i = 0; i < mags.length; i++) {
    div.innerHTML +=
      '<i style="background:' + Color(mags[i] + 1) + '"></i> ' +
       mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
  

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  

}
