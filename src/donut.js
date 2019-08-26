import {
    select
} from "./util"
import * as d3 from "d3"


export function enrollmentRaceDiversity(data1, data2) {

    const compare = data1 && data2

    const keys = ["percentEnrolledAIAN", "percentEnrolledA", "percentEnrolledNHPI", "percentEnrollBAA",
        "percentEenrolledHL", "percentEnrolledW", "percentEnrolledU", "percentEnrolledNA", "percentEnrolledM"
    ]

    const legendLabels = {
        "percentEnrolledAIAN": "American Indian or Alaska Native",
        "percentEnrolledA": "Asian",
        "percentEnrolledNHPI": "Native Hawaiian or Other Pacific Islander",
        "percentEnrollBAA": "Black or African American",
        "percentEenrolledHL": "Hispanic or Latino",
        "percentEnrolledW": "White",
        "percentEnrolledU": "Race/ethicity Unknown",
        "percentEnrolledNA": "Non-resident Alien",
        "percentEnrolledM": "Two or more races"
    }

    const diversityData1 = d3.entries(select(keys, data1))

    const margin = {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20
        },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        outerRadius = height / 2 - 20,
        innerRadius = outerRadius - 70


    const pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        })
        .padAngle(.02);

    const arc = d3.arc()
        .padRadius(outerRadius)
        .innerRadius(innerRadius);

    const colors = d3.scaleOrdinal()
        .domain(keys)
        .range(["#00b8a9", "#f8f3d4", "#f6416c", "#ffde7d", "#B276B2", "#5DA5DA", "#FAA43A", "#F17CB0", "#F15854"])

    const centerRadius = innerRadius * 0.8

    const container = d3.select(".statistics").append("div").attr("class", "diversity")

    const description = "Students may want to consider the racial and ethnic diversity of a college campus when choosing a school. The data are drawn from each institution's fall 2017 total undergraduate student body."



    createDonut(diversityData1)
    createCenter()
    if (compare) {
        var diversityData2 = d3.entries(select(keys, data2))
        createDonut(diversityData2)
    }

    function createDonut(diversityData) {
        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.selectAll("path")
            .data(pie(diversityData))
            .enter()
            .append("path")
            .each((d) => {
                d.outerRadius = outerRadius - 20;
            })
            .attr("d", arc)
            .attr("fill", (d) => colors(d.data.key))
            .on("mouseover", arcTween(outerRadius, 0, true))
            .on("mouseover.slice", (d) => {
                svg.select(".costs-circle")
                    .style("fill", colors(d.data.key))
                svg.select(".center-stats-text").text(d.data.value + "%")
                comparison(d)
            })
            .on("mouseout", arcTween(outerRadius - 20, 150))
            .on("mouseout.slice", (d) => {
                resetComparison()
            })

        svg.append("circle")
            .attr("class", "costs-circle")
            .attr("r", centerRadius)
            .style("fill", "#E7E7E7")
            .on("mouseover", (d) => {
                svg.select(".costs-circle")
                    .transition()
                    .duration(1000)
                    .attr("r", centerRadius * 1.1)
            })
            .on("mouseout", (d) => {
                svg.select(".costs-circle")
                    .transition()
                    .duration(1000)
                    .ease(d3.easeBounce)
                    .attr("r", centerRadius)
            })

        svg.append("text")
            .attr('class', 'center-stats-text')
            .text("100%")
            .attr("transform", `translate(-${centerRadius / 3}, ${centerRadius / 6})`)

        function arcTween(outerRadius, delay) {
            return function (d) {
                d3.select(this).transition().delay(delay).attrTween("d", function (d) {
                    const i = d3.interpolate(d.outerRadius, outerRadius);
                    return function (t) {
                        d.outerRadius = i(t);
                        return arc(d);
                    };
                });
            };
        }

        function comparison(d) {
            if (compare) {
                const compareTo = diversityData === diversityData1 ? diversityData2 : diversityData1
                const {
                    key,
                    value
                } = d.data
                const compareToValue = compareTo.find(datum => datum.key === key).value
                const compareTextPercent = container.select(".comparison-data-percent")
                const percentage = value - compareToValue
                compareTextPercent.text(`${percentage > 0 ? "+" : ""}${percentage}%`)
                compareTextPercent.style("fill", percentage < 0 ? "red" : "green")
                compareTextPercent.transition()
                    .duration(1000)
                    .attr("font-size", 36)
            }

        }

        function resetComparison() {
            if (compare) {
                const percentText = container.select(".comparison-data-percent")
                percentText.text("").attr("font-size", 16)
            }
        }
    }

    function createCenter() {

        const svg = container
            .append("svg")
            .attr("width", 400)
            .attr("height", height)

        svg.selectAll("square")
            .data(keys)
            .enter()
            .append("rect")
            .attr("transform", (d, i) => {
                return `translate(60 ,${50 + i * 20})`
            })
            .attr("height", 20)
            .attr("width", 20)
            .style("fill", function (d) {
                return colors(d)
            })

        svg.selectAll("label")
            .data(keys)
            .enter()
            .append("text")
            .attr("transform", (d, i) => {
                return `translate(90 ,${65 + i * 20})`
            })
            .text(d => legendLabels[d])

        svg.append("text")
            .attr("class", "comparison-data-percent")
            .attr("transform", (d) => {
                return `translate(175, 285)`
            })
    }

}