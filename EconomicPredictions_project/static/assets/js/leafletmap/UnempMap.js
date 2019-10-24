
// URL for county lines data
countyLink1970 = "/static/assets/geojson/FinalGeoFile1970.json";
countyLink1980 = "/static/assets/geojson/FinalGeoFile1980.json";
countyLink1990 = "/static/assets/geojson/FinalGeoFile1990.json";
countyLink1991 = "/static/assets/geojson/FinalGeoFile1991.json";
countyLink1992 = "/static/assets/geojson/FinalGeoFile1992.json";
countyLink1993 = "/static/assets/geojson/FinalGeoFile1993.json";
countyLink1994 = "/static/assets/geojson/FinalGeoFile1994.json";
countyLink1995 = "/static/assets/geojson/FinalGeoFile1995.json";
countyLink1996 = "/static/assets/geojson/FinalGeoFile1996.json";
countyLink1997 = "/static/assets/geojson/FinalGeoFile1997.json";
countyLink1998 = "/static/assets/geojson/FinalGeoFile1998.json";
countyLink1999 = "/static/assets/geojson/FinalGeoFile1999.json";
countyLink2000 = "/static/assets/geojson/FinalGeoFile2000.json";
countyLink2001 = "/static/assets/geojson/FinalGeoFile2001.json";
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
countyLink2018 = "/static/assets/geojson/FinalGeoFile2018.json";
countyLink2019 = "/static/assets/geojson/FinalGeoFile2019.json";

// URL for state lines
stateLink = "/static/assets/geojson/gz_2010_us_040_00_500k.json";

// Center of the map we will create (middle of continental US)
centerLoc = [39.82, -98.58];


// Function that will determine the color of a county based on its unemployment rate
function getColor(d) {
  return d > 9  ? '#800026' :
         d > 8   ? '#bd0026' :
         d > 6   ? '#e31a1c' :
         d > 5   ? '#fc4e2a' :
         d > 4   ? '#fd8d3c' :
         d > 3   ? '#feb24c' :
         d > 2   ? '#fed976' :
         d > 1   ? '#ffeda0' :
         d > 0   ? '#ffffcc' :
         '#gray' 
}
function getColor2(d) {
  return d > 9  ? '#543005' :
         d > 8   ? '#8c510a' :
         d > 7   ? '#bf812d' :
         d > 6   ? '#dfc27d' :
         d > 5   ? '#f6e8c3' :
         d > 4   ? '#c7eae5' :
         d > 3   ? '#80cdc1' :
         d > 2   ? '#35978f' :
         d > 1   ? '#01665e' :
         d > 0   ? '#003c30' :
         "#gray"
}

function getColor3(d) {
  return d > 9  ? '#a50026' :
         d > 8   ? '#d73027' :
         d > 7   ? '#f46d43' :
         d > 6   ? '#fdae61' :
         d > 5   ? '#fee08b' :
         d > 4   ? '#d9ef8b' :
         d > 3   ? '#a6d96a' :
         d > 2   ? '#66bd63' :
         d > 1   ? '#1a9850' :
         d > 0   ? '#006837' :
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


function monthLayers(year,month,countyLink,countyLayer){
  
  // Pull in the county geojson file
  d3.json(countyLink).then(function(countyData){

    feature = countyData.features;
    
    //console.log(feature);
    if (month < 10){
      month = `0${month}`;
    }

    var2get=`Unemp_${year}${month}`;
    console.log(var2get);

    // Add a layer with the county outlines.
    geoJson = L.geoJson(countyData,{

      // Style for each feature (in this case a neighborhood)
      style: function(feature) {
        
         return {
          color: "white",
          // Call the chooseColor function to decide which color to color each county (color based on unemployment rate)
          fillColor: getColor3(feature.properties[var2get]),
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
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.75
            });
          }        });
        // Giving each feature a pop-up with information about that specific feature
        layer.bindPopup("<h3>" + feature.properties['CountyName'] +', ' + feature.properties.StateAbbr + ` ${year}` +
                        "</h3><p>Unemployement Rate: " + feature.properties[var2get] + "</p>");
    
      }
    }).addTo(countyLayer);

  });

}

// Create a blank array to hold all of the layers we will create
var layers = [];
var descrs = []
/*
for (var y = 1990; y < 1991; y++) {

  for (var m = 1; m <= 12; m++) {

    if (m < 10){
      mm = `0${m}`;
    }
    link2use = `countyLink${y}${mm}`
    layer2use = `countyLayer${y}${mm}`
    desc2use = `${y}${mm}`

    // Create the layer for this year and month. Then push to the layer array.
    monthLayers(y,m,link2use,layer2use);
    layers.push(layer2use);
    descrs.push(desc2use);
  }
}
// For 2019 we only have unemployment data up to July
for (var m = 1; m <= 7; m++) {

  if (m < 10){
    mm = `0${m}`;
  }
  link2use = `countyLink2019${mm}`
  layer2use = `countyLayer2019${mm}`
  desc2use = `2019${mm}`

  // Create the layer for this year and month. Then push to the layer array.
  monthLayers(2019,m,link2use,layer2use);
  layers.push(layer2use);
  descrs.push(desc2use);
}
*/
var countyLayer199007 = new L.LayerGroup();
monthLayers(1990,07,countyLink1990,countyLayer199007);
layers.push(countyLayer199007);
descrs.push(1990);
var countyLayer199507 = new L.LayerGroup();
monthLayers(1995,07,countyLink1995,countyLayer199507);
layers.push(countyLayer199507);
descrs.push(1995);
var countyLayer200007 = new L.LayerGroup();
monthLayers(2000,07,countyLink2000,countyLayer200007);
layers.push(countyLayer200007);
descrs.push(2000);
var countyLayer200507 = new L.LayerGroup();
monthLayers(2005,07,countyLink2005,countyLayer200507);
layers.push(countyLayer200507);
descrs.push(2005);
var countyLayer200707 = new L.LayerGroup();
monthLayers(2007,07,countyLink2007,countyLayer200707);
layers.push(countyLayer200707);
descrs.push(2007);
var countyLayer201007 = new L.LayerGroup();
monthLayers(2010,07,countyLink2010,countyLayer201007);
layers.push(countyLayer201007);
descrs.push(2010);
var countyLayer201307 = new L.LayerGroup();
monthLayers(2013,07,countyLink2013,countyLayer201307);
layers.push(countyLayer201307);
descrs.push(2013);
var countyLayer201407 = new L.LayerGroup();
monthLayers(2014,07,countyLink2014,countyLayer201407);
layers.push(countyLayer201407);
descrs.push(2014);
var countyLayer201507 = new L.LayerGroup();
monthLayers(2015,07,countyLink2015,countyLayer201507);
layers.push(countyLayer201507);
descrs.push(2015);
var countyLayer201607 = new L.LayerGroup();
monthLayers(2016,07,countyLink2016,countyLayer201607);
layers.push(countyLayer201607);
descrs.push(2016);
var countyLayer201707 = new L.LayerGroup();
monthLayers(2017,07,countyLink2017,countyLayer201707);
layers.push(countyLayer201707);
descrs.push(2017);
var countyLayer201807 = new L.LayerGroup();
monthLayers(2018,07,countyLink2018,countyLayer201807);
layers.push(countyLayer201807);
descrs.push(2018);
var countyLayer201907 = new L.LayerGroup();
monthLayers(2019,07,countyLink2019,countyLayer201907);
layers.push(countyLayer201907);
descrs.push(2019);

// Create an overlayMaps object to hold the unemployment layers
var baseMaps = {
};

// Create an overlayMaps object to hold the state layer
var overlayMaps = {
  "State Borders"    : stateLayer
};
 
// Create the map object with options
var myMap = L.map("map", {
  center: centerLoc,
  zoom: 4,
  layers: [usmap,countyLayer199007]
});


// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Create a legent and add it to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
  
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    labels = ['1','2','3','4','5', '6', '7', '8', '9+'];
  
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor3(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
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
   }, 750); // delay between layer adds in milliseconds
}
gogogo();
newTopLayer(0);

L.control.timelineSlider({
  timelineItems: descrs,
  extraChangeMapParams: {greeting: "Slide to see change in unemployment over time"}, 
  changeMap: switchYear,
  labelFontSize: 9,
  position: 'bottomleft' })
.addTo(myMap);
