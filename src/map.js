import * as d3 from "d3";
import axios from "axios";
import {
    viewSetup
} from "./data"



window.selectedUniversities = []


window.initMap = () => {
    window.map = new google.maps.Map(d3.select("#map").node(), {
        center: {
            lat: 39.8097343,
            lng: -98.5556199
        },
        zoom: 4,
        backgroundColor: 'hsla(0, 0%, 0%, 0)',
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
        .then((data) => {
            markers = data.map(university => {
                const latLng = {
                    lat: +university.lat,
                    lng: +university.lng
                };
                const marker = addMarker(latLng);
                addInfoWindow(marker, university.universityName);
                return marker;
            });

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
            `${image ? `<img src=${image} class="university-photo"></img>` : ""}` +
            `<div class="university-info"> ${description} <span class="statistics-link" data-university="${universityName}"` +
            `data-image="${image}" data-description="${description}">Select<span> </div>`
        );

        infoWindow.open(map, marker);
        google.maps.event.addListener(infoWindow, 'domready', () => {

            const links = d3.selectAll(".statistics-link").nodes()
            links.forEach((link) => {
                link.addEventListener("click", () => {
                    let proceed = true
                    if (selectedUniversities.length < 2 && !selectedUniversities.find((datum) => {
                            return datum.universityName === universityName
                        })) {
                        const universityObj = {
                            universityName,
                            universityDescription: link.dataset.description,
                            universityImage: link.dataset.image
                        }
                        selectedUniversities.push(universityObj)
                        d3.select(".homepage-arrow").style("display", selectedUniversities.length ? "block" : "none")
                    } else {
                        alert("warning message placeholder")
                        proceed = false
                    }
                    if (proceed) {
                        infoWindow.close();
                        const [
                            university1 = null,
                            university2 = null
                        ] = selectedUniversities
                        d3.select(".selected-universities").html(`Selected: ${university1 ? `<div class="selected" data-university="${university1.universityName}">${university1.universityName} <span class="unselect-option">X</span></div>` : ""} ${university2 ? `<div class="selected" data-university="${university2.universityName}">${university2.universityName} <span class="unselect-option">X</span></div>` : ""}`)
                        const unselectOptions = d3.selectAll(".unselect-option").nodes()

                        unselectOptions.forEach(option => {
                            option.addEventListener("click", (e) => {

                                const idx = selectedUniversities.indexOf(selectedUniversities.find((datum) => datum.universityName === option.parentNode.dataset.university))
                                selectedUniversities.splice(idx, 1);
                                const [university1 = null, university2 = null] = selectedUniversities
                        d3.select(".selected-universities").html(`Selected: ${university1 ? `<div class="selected" data-university="${university1.universityName}">${university1.universityName} <span class="unselect-option">X</span></div>` : ""} ${university2 ? `<div class="selected" data-university="${university2.universityName}">${university2.universityName} <span class="unselect-option">X</span></div>` : ""}`)
                                d3.select(".homepage-arrow").style("display", selectedUniversities.length ? "block" : "none")
                            })
                        })
                      
                    }
                })
            })


        });
    });
}



function addMarker(location) {
    let marker = new google.maps.Marker({
        position: location,
        map: map
    });
    return marker;
}

function zoomIn(map, desiredZoomLevel, currentZoomLevel) {
    if (currentZoomLevel >= desiredZoomLevel) {
        return;
    } else {
        const zoom = google.maps.event.addListener(map, 'zoom_changed', function (event) {
            google.maps.event.removeListener(zoom);
            zoomIn(map, desiredZoomLevel, currentZoomLevel + 1);
        });
        setTimeout(function () {
            map.setZoom(currentZoomLevel)
        }, 80);
    }
}

export function smoothZoom(map, desiredZoomLevel, currentZoomLevel, latLng) {
    if (currentZoomLevel <= desiredZoomLevel) {
        map.panTo(latLng)
        zoomIn(map, 20, map.getZoom())
    } else {
        const zoom = google.maps.event.addListener(map, 'zoom_changed', function (event) {
            google.maps.event.removeListener(zoom);
            smoothZoom(map, desiredZoomLevel, currentZoomLevel - 1, latLng);
        });
        setTimeout(function () {
            map.setZoom(currentZoomLevel)
        }, 80);
    }
}