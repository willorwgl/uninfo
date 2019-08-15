import anime from 'animejs/lib/anime.es.js';
import * as d3 from "d3"

export function pageTransitionAnimation(transitionFrom, transitionTo) {
    anime({
        targets: '[class|="transition-rect"]',
        width: "100%",
        easing: 'easeInOutQuad',
        delay: anime.stagger(300),
        endDelay: 500,
        complete: () => {
            toggleDisplay(transitionFrom)
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
        duration: 5000,
        complete: resetSpread
    })
}

function resetSpread() {
    anime({
        targets: ".spread",
        scale: 1,
        duration: 3000,
    })
    toggleDisplay(".spread")
}

function spreadAnimation() {
    toggleDisplay(".spread")
    anime({
        targets: ".spread",
        scale: 170,
        duration: 3000,
        complete: () => {
            anime({
                targets: '[class|="transition-rect"]',
                width: "0%",
                easing: 'easeInOutQuad',
            })
        }
    })
    setTimeout(displayStatistics, 2000)
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