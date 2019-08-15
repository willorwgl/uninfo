import * as d3 from "d3"

let statistics;

function setup() {
    d3.csv("/data/statistics.csv").then((unfilteredData) => {
        debugger
        unfilteredData.forEach((university) => {

        })
        return unfilteredData
    }).then((filteredData) => {

    })
}