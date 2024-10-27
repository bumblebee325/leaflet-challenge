// Initialize the map centered on the US
var map = L.map('map').setView([37.09, -95.71], 5);

// Add a tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


const geoJsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data
fetch(geoJsonUrl)
    .then(response => response.json())
    .then(data => {
        visualizeEarthquakes(data);
    })
    .catch(error => console.error("Error fetching data:", error));

// Function to plot earthquake data on the map
function visualizeEarthquakes(data) {
    data.features.forEach(feature => {
        // Extract relevant data
        const coords = feature.geometry.coordinates; // [longitude, latitude, depth]
        const mag = feature.properties.mag;           // magnitude
        const place = feature.properties.place;       // location description
        const depth = coords[2];                      // depth from the coordinates array

        // Add a circle marker for each earthquake
        L.circleMarker([coords[1], coords[0]], {
            radius: mag * 3, // Scale size by magnitude
            fillColor: getColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        })
        .bindPopup(`Magnitude: ${mag}<br>Depth: ${depth} km<br>Location: ${place}`)
        .addTo(map);
    });
}

// Helper function for color based on depth
function getColor(depth) {
    return depth > 90 ? "#ff0000" :
           depth > 70 ? "#ff6600" :
           depth > 50 ? "#ff9900" :
           depth > 30 ? "#ffcc00" :
           depth > 10 ? "#ccff00" :
                        "#00ff00";
}


// Legend control
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var labels = ["<strong>Depth (km)</strong>"];

    grades.forEach((grade, index) => {
        div.innerHTML +=
            `<i style="background:${getColor(grade + 1)}"></i> ` +
            grade + (grades[index + 1] ? `&ndash;${grades[index + 1]}<br>` : "+");
    });

    return div;
};

// Add the legend to the map
legend.addTo(map);
