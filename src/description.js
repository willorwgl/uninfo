import * as d3 from "d3"


export function universityDescription(descriptions, images) {
    const compare = descriptions.length === 2
    const container = d3.select(".statistics")
        .append("div")
        .attr("class", "description")

    const html = `<div><img src=${images[0]} class="university-photo"></img> ${descriptions[0]}</div> ${compare ? `<div> ${descriptions[1]} <img src=${images[1]} class="university-photo"></img> </div>` : ""}`
    container.html(html)

}