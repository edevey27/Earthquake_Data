let basemap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
})

basemap.addTo(map);

function getColor(depth) {
    if (depth > 90) {
        return "#FF0000"; // Red for depths greater than 90
    } else if (depth > 70) {
        return "#FF4500"; // Dark Orange for depths greater than 70
    } else if (depth > 50) {
        return "#FFA500"; // Orange for depths greater than 50
    } else if (depth > 30) {
        return "#FFFF00"; // Yellow for depths greater than 30
    } else if (depth > 10) {
        return "#ADFF2F"; // Light Green for depths greater than 10
    } else {
        return "#00FF00"; // Dark Green for depths less than or equal to 10
    }
}

function getRadius(magnitude) {
    if(magnitude === 0) {
        return 1
    } 
    return magnitude * 4
}



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    console.log(data);
    function styleInfo(feature)
    {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.6
        }
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`
                Magnitude: ${feature.properties.mag} <br>
                Depth: ${feature.geometry.coordinates[2]} <br>
                Location: ${feature.properties.place}
            `);
        }
    }).addTo(map);

    let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(){
        let container = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ['#00FF00', '#ADFF2F', '#FFFF00', '#FFA500', '#FF4500', '#FF0000'];
        for(let index = 0; index < grades.length; index++) {
           container.innerHTML += `<i style="background: ${colors[index]}"></i> ${grades[index]}+ <br>` 
        }
        return container
    }
    legend.addTo(map);
})