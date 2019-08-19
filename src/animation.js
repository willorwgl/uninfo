import anime from 'animejs/lib/anime.es.js';
import * as d3 from "d3"
import { viewSetup } from './data';

export function pageTransitionAnimation(fromHomepage) {
    anime({
        targets: '[class|="transition-rect"]',
        width: "100%",
        easing: 'easeInOutQuad',
        delay: anime.stagger(300),
        duration: 1500,
        endDelay: 250,
        complete: () => {
            fromHomepage ? toggleDisplay(".main") : toggleDisplay(".statistics")
            dripDropAnimation()
        }
    });
}



function toggleDisplay(query) {
    const el = d3.select(query)
    el.style("display") === "none" ? el.style("display", "block") : el.style("display", "none")
}

function displayStatistics() {
    anime({
        targets: ".statistics",
        opacity: 1,
        complete: () => {
            viewSetup(universityName)
        }
    })
}

function resetSpread() {
    toggleDisplay(".spread")
    anime({
        targets: ".spread",
        scale: 1,
        duration: 3000,
    })

}

function spreadAnimation() {
    toggleDisplay(".spread")
    setTimeout(() => {
           anime({
               targets: '[class|="transition-rect"]',
               width: "0%",
               easing: 'easeInOutQuad',
           })
    }, 500)
    anime({
        targets: ".spread",
        scale: 250,
        duration: 1500,
        complete: () => {
            resetSpread()
            displayStatistics()
        }
    })
}

function dripDropAnimation() {
    toggleDisplay(".drip-drop")
    anime({
        targets: ".drip-drop",
        translateY: 400,
        complete: () => {
            toggleDisplay(".drip-drop")
            spreadAnimation()
        }
    })

}