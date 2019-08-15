import * as Map from "./map"
import * as d3 from "d3"

document.addEventListener("DOMContentLoaded", async () => {
    let csvData;
    await d3.csv("/data/location.csv").then(
        (response) => {
            csvData = response
        }
    )
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
        placeHolder: "Universities ...",
        selector: "#autoComplete",
        threshold: 0,
        debounce: 300,
        searchEngine: "strict",
        maxResults: 5,
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
        // noResults: () => {
        //     const result = document.createElement("li");
        //     result.setAttribute("class", "no_result");
        //     result.setAttribute("tabindex", "1");
        //     result.innerHTML = "No Results";
        //     document.querySelector("#autoComplete_results_list").appendChild(result);
        // },
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
    
})