import * as d3 from "d3"
import {
    enrollmentGenderDiversity,
    applicationGenderDiversity
} from "./pie"
import {
    costBarChart,
    SATBarChart,
    admissionBarChart,
    ACTBarChart
} from "./bar_graph"
import {
    enrollmentRaceDiversity
} from "./donut"


export function setup() {
    d3.csv("/data/statistics.csv").then((unfilteredData) => {
        unfilteredData.forEach((university) => {
            Object.keys(university).forEach((key) => {
                if (key !== "universityName") university[key] = +university[key]
            })
        })
        return unfilteredData
    }).then((filteredData) => {
        window.statistics = filteredData
    })
}

export function viewSetup(selectedUniversities) {
    const [university1, university2 = "Boston College"] = selectedUniversities
    const data1 = statistics.find((university) => {
        return university.universityName === university1
    })
    let data2;
    if (university2) {
        data2 = statistics.find((university) => {
            return university.universityName === university2
        })
    }

    costBarChart(data1, data2)
    enrollmentRaceDiversity(data1, data2)
    applicationGenderDiversity(data1, data2)
    enrollmentGenderDiversity(data1, data2)
    admissionBarChart(data1, data2)
    SATBarChart(data1, data2)
    ACTBarChart(data1, data2)
}