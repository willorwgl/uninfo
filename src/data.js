import * as d3 from "d3"
import {
    enrollmentGenderDiversity,
    applicationGenderDiversity
} from "./pie"
import axios from "axios"
import {
    costBarChart,
    SATBarChart,
    admissionBarChart,
    ACTBarChart
} from "./bar_graph"
import {
    enrollmentRaceDiversity
} from "./donut"
import {
    universityDescription
} from "./description";


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

export async function viewSetup(selectedUniversities) {
    const [university1 = {}, university2 = {}] = selectedUniversities

    const data1 = statistics.find((university) => {
        return university.universityName === university1.universityName
    })
    let data2;
    if (university2) {
        data2 = statistics.find((university) => {
            return university.universityName === university2.universityName
        })
    }

    let universityDescriptions = [],
        basicSummaries = [university1.universityDescription, university2.universityDescription],
        universityImages = [university1.universityImage, university2.universityImage]
    await new Promise(async (resolve) => {
        let key = 0
        for (let university of selectedUniversities) {
            const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${university}&continue=&format=json&formatversion=2&origin=*`;
            await axios.get(endpoint).then(response => response.data).then(data => {
                const description = data.query.pages[0].extract
                description ? universityDescriptions.push(description) : universityDescriptions.push(basicSummaries[key])
            });
            key++;
        }
        resolve(null)
    })
    setupDataOptions()

    function setupDataOptions() {
        const container = d3.select(".statistics");
        universityDescription(universityDescriptions, universityImages)
        let selectedOption = "description"
        d3.select(".price-option").on("click", () => {
            if (selectedOption != "price") {
                reset()
                costBarChart(data1, data2)
                selectedOption = "price"
            }
        })

        d3.select(".sat-option").on("click", () => {
            if (selectedOption != "sat") {
                reset()
                SATBarChart(data1, data2)
                selectedOption = "sat"
            }
        })
        d3.select(".act-option").on("click", () => {
            if (selectedOption != "act") {
                reset()
                ACTBarChart(data1, data2)
                selectedOption = "act"
            }
        })
        d3.select(".enrollment-option").on("click", () => {
            if (selectedOption != "enrollment") {
                reset()
                enrollmentGenderDiversity(data1, data2)
                selectedOption = "enrollment"
            }
        })
        d3.select(".admission-option").on("click", () => {
            if (selectedOption != "admission") {
                reset()
                admissionBarChart(data1, data2)
                selectedOption = "admission"
            }

        })
        d3.select(".diversity-option").on("click", () => {
            if (selectedOption != "diversity") {
                reset()
                enrollmentRaceDiversity(data1, data2)
                selectedOption = "diversity"
            }
        })
        d3.select(".application-option").on("click", () => {
            if (selectedOption != "application") {
                reset()
                applicationGenderDiversity(data1, data2)
                selectedOption = "application"
            }
        })
        d3.select(".description-option").on("click", () => {
            if (selectedOption != "description") {
                reset()
                universityDescription(universityDescriptions, universityImages)
                selectedOption = "description"
            }
        })

        function reset() {
            container.html("")
        }
    }
}