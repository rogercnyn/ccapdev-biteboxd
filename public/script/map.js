// Initialize Leaflet map
var map = L.map('map').setView([14.5604805, 120.9909801], 16); // DLSU Branch coordinates

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker to the map
L.marker([14.5604805, 120.9909801]).addTo(map)
  .bindPopup("Ate Rica's Bacsilog on-the-go DLSU Branch")
  .openPopup();
