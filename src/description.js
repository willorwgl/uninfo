import * as d3 from "d3"


export function universityDescription(descriptions, images) {
    const compare = descriptions.length === 2
    const container = d3.select(".statistics")
        .append("div")
        .attr("class", "description")
    debugger
    const html = `<div><img src=${images[0] ? images[0] :  "./src/assets/images/university.png"} class="university-photo"></img> ${descriptions[0]}</div> ${compare ? `<div> ${descriptions[1]} <img src=${images[1] ? images[1] : "./src/assets/images/university.png"} class="university-photo"></img> </div>` : ""}`
    container.html(html)

}