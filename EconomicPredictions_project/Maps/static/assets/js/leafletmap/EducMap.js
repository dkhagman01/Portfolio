
// URL for county lines data

countyLink1970 = "/static/assets/geojson/FinalGeoFile1970.json";
countyLink1980 = "/static/assets/geojson/FinalGeoFile1980.json";
countyLink1990 = "/static/assets/geojson/FinalGeoFile1990.json";
countyLink2000 = "/static/assets/geojson/FinalGeoFile2000.json";
countyLink2013 = "/static/assets/geojson/FinalGeoFile2013.json";

// URL for state lines
stateLink = "/static/assets/geojson/gz_2010_us_040_00_500k.json";

// Center of the map we will create (middle of continental US)
centerLoc = [39.82, -98.58];


function getEducColors(d) {
  return d > 45   ? '#543005' :
         d > 40   ? '#8c510a' :
         d > 30   ? '#bf812d' :
         d > 25   ? '#dfc27d' :
         d > 20   ? '#f6e8c3' :
         d > 15   ? '#c7eae5' :
         d > 10   ? '#80cdc1' :
         d > 7    ? '#35978f' :
         d > 5    ? '#01665e' :
         d > 3    ? '#003c30' :
         "#gray"
}

// Create basic US map
var usmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Add a layer for state outlines
var stateLayer = new L.LayerGroup();
var geoJson;

// Pull in the state geojson file
d3.json(stateLink).then(function(stateData){

    feature = stateData.features;
    //console.log(feature);

    // Add a layer with the county outlines.
    geoJson = L.geoJson(stateData,{

      // Style for each feature (in this case a neighborhood)
      style: function(feature) {
        return {
          color: "black",
          fillOpacity : 0,
          weight: 1
          }
      },

    }).addTo(stateLayer);
});

// Add a layer for the county boundaries
var GDPLayer1970 = new L.LayerGroup();
var GDPLayer1980 = new L.LayerGroup();
var GDPLayer1990 = new L.LayerGroup();
var GDPLayer2000 = new L.LayerGroup();
var GDPLayer2013 = new L.LayerGroup();

function EducLayers(year,countyLink,countyLayer){
  
  // Pull in the county geojson file
  d3.json(countyLink).then(function(countyData){

    feature = countyData.features;
    //console.log(feature);

    // Add a layer with the county outlines.
    geoJson = L.geoJson(countyData,{

      // Style for each feature (in this case a neighborhood)
      style: function(feature) {
        return {
          color: "white",
          // Call the chooseColor function to decide which color to color each county (color based on unemployment rate)
          fillColor: getEducColors(feature.properties.GRAD),
           fillOpacity: 0.75,
          weight: 1
          }
      },

      // Called on each feature
      onEachFeature: function(feature, layer) {

        // Setting various mouse events to change style when different events occur
        layer.on({
          // On mouse over, make the feature (neighborhood) more visible
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // Set the features style back to the way it was
          mouseout: function(event) {
            geoJson.resetStyle(event.target);
          }
        });
        // Giving each feature a pop-up with information about that specific feature
        layer.bindPopup("<h3>" + feature.properties.CountyName +', ' + feature.properties.StateAbbr + ` ${year}` +
                        "</h3><p>% Less than high school: " + feature.properties.LTHS + 
                        "<br>% High school only: " + feature.properties.HS + 
                        "<br>% Some college: " + feature.properties.SomeColl + 
                        "<br>% College degree or higher:" + feature.properties.GRAD + "</p>");
    
      }
    }).addTo(countyLayer);

  });

}

EducLayers(1970,countyLink1970,educLayer1970);
EducLayers(1980,countyLink1980,educLayer1980);
EducLayers(1990,countyLink1990,educLayer1990);
EducLayers(2000,countyLink2000,educLayer2000);
EducLayers(2013,countyLink2013,educLayer2013);

// Create an overlayMaps object to hold the education layers
var baseMaps = {
};

// Create an overlayMaps object to hold the earthquakes layer
var overlayMaps = {
  "State Borders"    : stateLayer
};
 
// Create the map object with options
var myMap = L.map("map", {
  center: centerLoc,
  zoom: 4,
  layers: [usmap,educLayer1970]
});


// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Create a legent and add it to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
  
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [3, 5, 7, 10, 15, 20, 25, 30, 40, 45, 46];
    
  
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getEducColors(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<p>' : '+');
  }
  return div;
};
legend.addTo(myMap);

var layers = [educLayer1970,educLayer1980,educLayer1990,educLayer2000,educLayer2013];

function switchYear( {value} ){
  
  layerPlace = parseInt(value)-1;
  newTopLayer(layerPlace);
}

// define addLayer function
function newTopLayer(layerNumber) {
 
  for (var i = 0; i < layers.length; i++) {
    myMap.removeLayer(layers[i]);
  };
  myMap.addLayer(layers[layerNumber]);
  
}

// and the length of said array so that the timer will stop
var arrayLength = layers.length;

// set the counter for the timer
var i = 0;                     

// set the timer delay function to add layers to map, calling function name in HTML button
function gogogo () {           
   setTimeout(function () {    

      // Set the slider to each year in order. It will cause the slider function to execute and move through the years.
      var ranges=document.getElementsByClassName('range-labels')[0].getElementsByTagName("li");
      ranges[i].click();
      
      i++;                     
      if (i < arrayLength) {            
         gogogo();             
      }    
   }, 2000); // delay between layer adds in milliseconds
}
gogogo();
newTopLayer(0);

L.control.timelineSlider({
  timelineItems: ["1970", "1980", "1990", "2000", "2013-2017"],
  extraChangeMapParams: {greeting: "Slide to see change in college graduation rates over time"}, 
  changeMap: switchYear,
  position: 'bottomleft' })
.addTo(myMap);
