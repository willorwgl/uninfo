import anime from 'animejs/lib/anime.es.js';
import * as d3 from "d3"
import {
    viewSetup
} from './data';

export function homepageTransitionAnimation() {
    d3.select(".statistics-container").style("display", "block")
    anime({
        targets: '.statistics-container',
        translateX: "-100%",
        easing: 'easeInOutQuad',
        duration: 1500,
        complete: () => {
            viewSetup(selectedUniversities)
            anime({
                targets: '.main',
                translateX: "-100%",
                complete: () => {
                    d3.select(".main").style("display", "none")
                    d3.select(".statistics-arrow").style("display", "block")
                    d3.select(".homepage-arrow").style("display", "none")

                }
            })
        }
    });
}

export function statisticsTransitionAnimation() {
    const main = d3.select(".main").style("display", "block").style("z-index", 5)
    const homeArrow = d3.select(".homepage-arrow").style("display", "none")
    anime({
        targets: '.main',
        translateX: "0%",
        easing: 'easeInOutQuad',
        duration: 1500,
        complete: () => {
            d3.select(".statistics-container").style("display", "none")
            d3.select(".statistics").html("")
            anime({
                targets: '.statistics-container',
                translateX: "0%",
                complete: () => {
                    main.style("z-index", 1)
                    d3.select(".statistics-arrow").style("display", "none")
                    homeArrow.style("display", "block")
                }
            })
        }
    });
}