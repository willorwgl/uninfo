import * as Map from "./map"
import * as d3 from "d3"
import anime from 'animejs/lib/anime.es.js';

document.addEventListener("DOMContentLoaded", async () => {
    let csvData;
    pageTransition()
    await d3.csv("/data/location.csv").then(
        (response) => {
            csvData = response
        }
    )
    document.querySelector("#autoComplete").addEventListener("autoComplete", event => {
        console.log(event);
    });
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
        placeHolder: "Universities",
        selector: "#autoComplete",
        threshold: 0,
        debounce: 300,
        searchEngine: "strict",
        highlight: true,
        maxResults: 5,
        resultsList: {
            render: true,
            container: source => {
                source.setAttribute("id", "autoComplete_results_list");
            },
            destination: document.querySelector("#autoComplete"),
            position: "afterend",
            element: "ul"
        },
        resultItem: {
            content: (data, source) => {
                source.innerHTML = data.match;
            },
            element: "li"
        },
        noResults: () => {
            const result = document.createElement("li");
            result.setAttribute("class", "no_result");
            result.setAttribute("tabindex", "1");
            result.innerHTML = "No Results";
            document.querySelector("#autoComplete_results_list").appendChild(result);
        },
        onSelection: feedback => {
            const selection = feedback.selection.value.food;
            document.querySelector(".selection").innerHTML = selection;
            document.querySelector("#autoComplete").value = "";
            document
                .querySelector("#autoComplete")
                .setAttribute("placeholder", selection);
            console.log(feedback);
        }
    });
})


function pageTransition() {
       anime({
           targets: '[class|="transition-rect"]',
           width: "100%",
           easing: 'easeInOutQuad',
           delay: anime.stagger(300),
           complete: () => {
                dripDropAnimation()
           }
       });
    //    anime({
    //        targets: '.transition-rect-2',
    //        width: "100%",
    //        easing: 'easeInOutQuad',
    //        delay: 500,
    //    });
    //    anime({
    //        targets: '.transition-rect-3',
    //        width: "100%",
    //        easing: 'easeInOutQuad',
    //        delay: 1000,
    //    });
    //    anime({
    //        targets: '.transition-rect-4',
    //        width: "100%",
    //        easing: 'easeInOutQuad',
    //        delay: 1500,
    //    });
    //    anime({
    //        targets: '.transition-rect-5',
    //        width: "100%",
    //        easing: 'easeInOutQuad',
    //        delay: 2000,
    //    });
}

function dripDropAnimation() {
    anime({
        targets: ".drip-drop",
         translateY: 400,
    })
}