// exercise 17-01-10 as template
// Store our API endpoint inside queryUrl
var queryUrlWeek = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//var queryUrlMonth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// added site for the tectonic plate mapping
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL
d3.json(queryUrlWeek, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place, time, and magnitude of the earthquake
  // Create a GeoJSON layer containing the earthquake features in earthquakeData
  // run with onEachFeature function for each data item in the array
  var earthquakes = L.geoJSON(earthquakeData, { 
    onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><h3><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    },

    pointToLayer: function(feature, latnlng) {
        return new L.circle(latnlng, {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            fillOpacity: 0.6,
            color: "#000",
            stroke: true,
            weight: 0.8
        })
    }
  });

  // Send earthquakes layer to createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite": satellitemap
    }

    // create a layer for the tectonic plates
    var tectonicPlates = new L.LayerGroup();

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes, tectonicPlates]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Add fault lines 
    d3.json(tectonicPlatesURL, function(plateData) {
        L.geoJSON(plateData, {
            color: "orange",
            weight: 2
        })
        .addTo(tectonicPlates);
    });

    // Create the legend display
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5, 6];

        //div.innerHTML+= 'Magnitude<br><hr>'
        div.innerHTML+= "<span style='color: white'>Magnitude<br><hr></span>"


        // from exercise 17-01-06
        // loop through the density intervals to create labels and assign color for each interval
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i> ' +
                "<span style='color: white'>" + (magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+')) + "</span>";
            var htmllegend =
                '<i style="background:' + getColor(magnitudes[i] + 1) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i> ' +
                    "<span style='color: white'>" + (magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+')) + "</span>";
                console.log(htmllegend);
            div.innerhtml += htmllegend;
    
        }
        return div; 
    };

    legend.addTo(myMap);

}

    // Create color scheme for circles and magnitude legend
    var colors = ['lightgreen', 'yellowgreen', 'yellow', 'orange', 'coral', 'red', 'crimson']

    // create function to generage the color scheme for the legend
    function getColor(c) {
        return  c > 6 ? colors[6] :
                c > 5 ? colors[5] :
                c > 4 ? colors[4] :
                c > 3 ? colors[3] :
                c > 2 ? colors[2] :
                c > 1 ? colors[1] :
                        colors[0];
    }

    //Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
    function getRadius(value){
        return value*25000
    }