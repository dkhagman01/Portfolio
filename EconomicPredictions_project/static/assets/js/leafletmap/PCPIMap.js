
// URL for county lines data

countyLink2002 = "/static/assets/geojson/FinalGeoFile2002.json";
countyLink2003 = "/static/assets/geojson/FinalGeoFile2003.json";
countyLink2004 = "/static/assets/geojson/FinalGeoFile2004.json";
countyLink2005 = "/static/assets/geojson/FinalGeoFile2005.json";
countyLink2006 = "/static/assets/geojson/FinalGeoFile2006.json";
countyLink2007 = "/static/assets/geojson/FinalGeoFile2007.json";
countyLink2008 = "/static/assets/geojson/FinalGeoFile2008.json";
countyLink2009 = "/static/assets/geojson/FinalGeoFile2009.json";
countyLink2010 = "/static/assets/geojson/FinalGeoFile2010.json";
countyLink2011 = "/static/assets/geojson/FinalGeoFile2011.json";
countyLink2012 = "/static/assets/geojson/FinalGeoFile2012.json";
countyLink2013 = "/static/assets/geojson/FinalGeoFile2013.json";
countyLink2014 = "/static/assets/geojson/FinalGeoFile2014.json";
countyLink2015 = "/static/assets/geojson/FinalGeoFile2015.json";
countyLink2016 = "/static/assets/geojson/FinalGeoFile2016.json";
countyLink2017 = "/static/assets/geojson/FinalGeoFile2017.json";

// URL for state lines
stateLink = "/static/assets/geojson/gz_2010_us_040_00_500k.json";

// Center of the map we will create (middle of continental US)
centerLoc = [39.82, -98.58];


// Function that will determine the color of a county based on its unemployment rate

function getColor(d) {
  return d > 15   ? '#006837' :
         d > 10   ? '#1a9850' :
         d > 5    ? '#66bd63' :
         d > 3    ? '#a6d96a' :
         d > 0    ? '#d9ef8b' :
         d > -3   ? '#fee08b' :
         d > -5   ? '#fdae61' :
         d > -10  ? '#f46d43' :
         d > -15  ? '#d73027' :
         d > -99  ? '#a50026' :
         "#lightgray"
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



var layers = [];
var descrs = [];

function yearLayers(year,countyLink,countyLayer){

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
          fillColor: getColor(feature.properties.PCPI_PctChange),
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
                        "</h3><p>Per-Capita Personal Income, Current: " + feature.properties.PCPI_Current + 
                        "<br>Per-Capita Personal Income, Previous: " + feature.properties.PCPI_Previous + 
                        "<br>Percent Change: " + feature.properties.PCPI_PctChange + "</p>");
    
      }
    }).addTo(countyLayer);

  });

}

var countyLayer2002 = new L.LayerGroup();
yearLayers(2002,countyLink2002,countyLayer2002);
layers.push(countyLayer2002);
descrs.push(2002);
var countyLayer2003 = new L.LayerGroup();
yearLayers(2003,countyLink2003,countyLayer2003);
layers.push(countyLayer2003);
descrs.push(2003);
var countyLayer2004 = new L.LayerGroup();
yearLayers(2004,countyLink2004,countyLayer2004);
layers.push(countyLayer2004);
descrs.push(2004);
var countyLayer2005 = new L.LayerGroup();
yearLayers(2005,countyLink2005,countyLayer2005);
layers.push(countyLayer2005);
descrs.push(2005);
var countyLayer2006 = new L.LayerGroup();
yearLayers(2006,countyLink2006,countyLayer2006);
layers.push(countyLayer2006);
descrs.push(2006);
var countyLayer2007 = new L.LayerGroup();
yearLayers(2007,countyLink2007,countyLayer2007);
layers.push(countyLayer2007);
descrs.push(2007);
var countyLayer2008 = new L.LayerGroup();
yearLayers(2008,countyLink2008,countyLayer2008);
layers.push(countyLayer2008);
descrs.push(2008);
var countyLayer2009 = new L.LayerGroup();
yearLayers(2009,countyLink2009,countyLayer2009);
layers.push(countyLayer2009);
descrs.push(2009);
var countyLayer2010 = new L.LayerGroup();
yearLayers(2010,countyLink2010,countyLayer2010);
layers.push(countyLayer2010);
descrs.push(2010);
var countyLayer2011 = new L.LayerGroup();
yearLayers(2011,countyLink2011,countyLayer2011);
layers.push(countyLayer2011);
descrs.push(2011);
var countyLayer2012 = new L.LayerGroup();
yearLayers(2012,countyLink2012,countyLayer2012);
layers.push(countyLayer2012);
descrs.push(2012);
var countyLayer2013 = new L.LayerGroup();
yearLayers(2013,countyLink2013,countyLayer2013);
layers.push(countyLayer2013);
descrs.push(2013);
var countyLayer2014 = new L.LayerGroup();
yearLayers(2014,countyLink2014,countyLayer2014);
layers.push(countyLayer2014);
descrs.push(2014);
var countyLayer2015 = new L.LayerGroup();
yearLayers(2015,countyLink2015,countyLayer2015);
layers.push(countyLayer2015);
descrs.push(2015);
var countyLayer2016 = new L.LayerGroup();
yearLayers(2016,countyLink2016,countyLayer2016);
layers.push(countyLayer2016);
descrs.push(2016);
var countyLayer2017 = new L.LayerGroup();
yearLayers(2017,countyLink2017,countyLayer2017);
layers.push(countyLayer2017);
descrs.push(2017);


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
  layers: [usmap,countyLayer2002]
});


// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Create a legent and add it to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
  
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [-20, -14, -9, -4, -2, 1, 4, 6, 11, 16];
    labels = ['<= -15','-15 to -10','-10 to -5','-5 to -3','-3 to 0','0 to 3','3 to 5','5 to 10','10 to 15','16+']
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i]) + '"></i>' + labels[i] + '<p>';
  } 
  return div;
};
legend.addTo(myMap);


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
   }, 1000); // delay between layer adds in milliseconds
}
gogogo();
newTopLayer(0);

L.control.timelineSlider({
  timelineItems: descrs,
  extraChangeMapParams: {greeting: "Slide to see change in Per-Capita Personal Income over time"}, 
  changeMap: switchYear,
  thumbHeight: 3,
  labelFontSize: 9,
  position: 'bottomleft' })
.addTo(myMap);
