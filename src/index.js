import * as Map from "./map"
import * as d3 from "d3"
import {
    setup
} from "./data"
import {
    statisticsTransitionAnimation,
    homepageTransitionAnimation
} from "./animation";

let csvData;
document.addEventListener("DOMContentLoaded", async () => {
    await d3.csv("./src/assets/data/location.csv").then(
        (response) => {
            csvData = response
        }
    )
    setup()

    const autoCompletejs = new autoComplete({
        data: {
            src: csvData,
            key: ["universityName"],
            cache: false
        },
        sort: (a, b) => {
            if (a.match < b.match) return -1;
            if (a.match > b.match) return 1;
            return 0;
        },
        placeHolder: "Search for universities here :)",
        selector: "#autoComplete",
        threshold: 0,
        debounce: 300,
        searchEngine: "strict",
        maxResults: 3,
        resultsList: {
            render: true,
            container: source => {
                source.setAttribute("id", "autoComplete_results_list");
            },
            destination: document.querySelector("#autoComplete-container"),
            position: "afterBegin",
            element: "ul"
        },
        resultItem: {
            content: (data, source) => {
                source.innerHTML = data.match;
            },
            element: "li"
        },
        onSelection: feedback => {
            const {
                lat,
                lng
            } = feedback.selection.value
            const latLng = {
                lat: +lat,
                lng: +lng
            }
            Map.smoothZoom(map, 4, map.getZoom(), latLng)
        }
    });
    d3.select(".statistics-arrow").on("click", statisticsTransitionAnimation)
    d3.select(".homepage-arrow").on("click", homepageTransitionAnimation)
})