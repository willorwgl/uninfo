import * as d3 from "d3";
import axios from "axios";

let map;

window.initMap = () => {
    map = new google.maps.Map(d3.select("#map").node(), {
        center: {
            lat: 39.8097343,
            lng: -98.5556199
        },
        zoom: 4,
        styles: [{
                featureType: "administrative",
                elementType: "labels.text.fill",
                stylers: [{
                    color: "#444444"
                }]
            },
            {
                featureType: "landscape",
                elementType: "all",
                stylers: [{
                    color: "#f2f2f2"
                }]
            },
            {
                featureType: "poi",
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "road",
                elementType: "all",
                stylers: [{
                        saturation: -100
                    },
                    {
                        lightness: 45
                    }
                ]
            },
            {
                featureType: "road.highway",
                elementType: "all",
                stylers: [{
                    visibility: "simplified"
                }]
            },
            {
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "transit",
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "water",
                elementType: "all",
                stylers: [{
                        color: "#46bcec"
                    },
                    {
                        visibility: "on"
                    }
                ]
            }
        ],
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });
    let markers;
    d3.csv("/data/location.csv")
        .then(function (data) {
            markers = data.map(university => {
                const latLng = {
                    lat: Number(university.lat),
                    lng: Number(university.lng)
                };
                const marker = addMarker(latLng);
                // marker.addListener("click", toggleBounce(marker));
                addInfoWindow(marker, university.universityName);
                return marker;
            });

            function toggleBounce(marker) {
                return e => {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                };
            }
        })
        .then(() => {
            const markerCluster = new MarkerClusterer(map, markers, {
                imagePath: "/src/assets/images/m"
            });
        });
};

function wikipediaSearch(searchCriteria) {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchCriteria}`;
    return axios.get(endpoint).then(response => response.data);
}

function addInfoWindow(marker, universityName) {
    const infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, "click", async () => {
        let description, image;
        await wikipediaSearch(universityName).then(data => {
            description = data.extract_html;
            image = data.thumbnail ? data.thumbnail.source : null;
        });
        infoWindow.setContent(
            `${image ? `<img src=${image} class="university-photo"></img>` : ""}${description}`
        );
        infoWindow.open(map, marker);
    });
}

function addMarker(location) {
    let marker = new google.maps.Marker({
        position: location,
        map: map
    });
    return marker;
}

 
