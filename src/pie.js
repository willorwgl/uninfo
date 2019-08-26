import {
    select
} from "./util"
import * as d3 from "d3"

export function enrollmentGenderDiversity(data1, data2) {
    const compare = data1 && data2
    const keys = ["enrolledWomen", "enrolledMen"]
    const enrollmentData1 = d3.entries(select(keys, data1))
    const enrollmentTotal1 = data1.enrolledTotal
    const margin = {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20
        },
        width = 380 - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom,
        outerRadius = height / 2 - 20,
        innerRadius = 0

    const legendLabels = {
        "enrolledWomen": "Female",
        "enrolledMen": "Male"
    }

    const pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        })

    const arc = d3.arc()
        .padRadius(outerRadius)
        .innerRadius(innerRadius);

    const colors = d3.scaleOrdinal()
        .domain(keys)
        .range(["#f06868", "#00bbf0"])

    const container = d3.select(".statistics").append("div").attr("class", "enrollment")

    createPie(enrollmentData1, enrollmentTotal1, data1.universityName)
    createCenter()
    if (compare) {
        var enrollmentData2 = d3.entries(select(keys, data2))
        var enrollmentTotal2 = data2.enrolledTotal
        createPie(enrollmentData2, enrollmentTotal2, data2.universityName)
    }

    function createPie(enrollmentData, enrollmentTotal, universityName) {
        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.append("text")
            .attr("y", -(height / 2 - 20))
            .attr("text-anchor", "middle")
            .style("text-decoration", "underline")
            .text(universityName);

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -(height / 2 - 20))
            .attr("x", (width / 4 - 20))
            .text("Enrollment")


        const arcs = svg.selectAll("g")
            .data(pie(enrollmentData))
            .enter()
            .append("g")
            .each((d) => {
                d.outerRadius = outerRadius - 20;
            })


        arcs.append("path")
            .attr("d", arc)
            .attr("fill", (d) => colors(d.data.key))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                const number = d.data.value
                const info = d3.select(this.parentNode).select("text")
                comparison(d)
                info.text(number)
                    .transition()
                    .attr("font-size", 24)
                    .duration(500)

            })
            .on("mouseout", function (d) {
                const number = d.data.value
                const info = d3.select(this.parentNode).select("text")
                info.text((number / enrollmentTotal * 100).toFixed(1) + "%")
                    .transition()
                    .ease(d3.easeBounceIn)
                    .attr("font-size", 16)
                    .duration(500)
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        arcs.append("text")
            .attr("transform", d => {
                return `translate(${arc.centroid(d)})`
            })
            .attr("fill", "white")
            .attr("font-size", 16)
            .attr("font-weight", 700)
            .attr("x", -20)
            .text(d => {
                const number = d.data.value
                return (number / enrollmentTotal * 100).toFixed(1) + "%"
            })



        function comparison(d) {
            if (compare) {
                const compareTo = enrollmentData === enrollmentData1 ? enrollmentData2 : enrollmentData1
                const compareToEnrollmentTotal = enrollmentTotal === enrollmentTotal1 ? enrollmentTotal2 : enrollmentTotal1
                const {
                    key,
                    value
                } = d.data
                const compareToValue = compareTo.find(datum => datum.key === key).value
                const compareTextPercent = container.select(".comparison-data-percent")
                const compareTextNumber = container.select(".comparison-data-number")

                if (compareToValue === 0 || value === 0) {
                    compareTextPercent.text(`N/A`)
                } else {
                    const percentage = ((value / enrollmentTotal - compareToValue / compareToEnrollmentTotal) * 100).toFixed(2)
                    compareTextPercent.text(`${percentage > 0 ? "+" : ""}${percentage}%`)
                    compareTextPercent.style("fill", percentage < 0 ? "red" : "green")
                    const difference = value - compareToValue
                    compareTextNumber.text(`${difference > 0 ? "+" : ""}${difference}`)
                    compareTextNumber.style("fill", difference < 0 ? "red" : "green")
                }

                compareTextPercent.transition()
                    .duration(1000)
                    .attr("font-size", 36)
                compareTextNumber.transition()
                    .duration(1000)
                    .attr("font-size", 24)

            }

        }

        function resetComparison() {
            if (compare) {
                const numberText = container.select(".comparison-data-number")
                const percentText = container.select(".comparison-data-percent")
                numberText.text("").attr("font-size", 16)
                percentText.text("").attr("font-size", 16)
            }
        }
    }



    function createCenter() {
        const svg = container
            .append("svg")
            .attr("width", 200)
            .attr("height", height)

        svg.append("text")
            .attr("class", "comparison-data-percent")
            .attr("transform", (d) => {
                return `translate(50, 195)`
            })

        svg.append("text")
            .attr("class", "comparison-data-number")
            .attr("transform", (d) => {
                return `translate(50, 225)`
            })

        svg.selectAll("square")
            .data(keys)
            .enter()
            .append("rect")
            .attr("transform", (d, i) => {
                return `translate(30 ,${50 + i * 20})`
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
                return `translate(60 ,${65 + i * 20})`
            })
            .text(d => legendLabels[d])
    }





}

export function applicationGenderDiversity(data1, data2) {
    const compare = data1 && data2
    const keys = ["applicantsWomen", "applicantsMen"]
    const applicationData1 = d3.entries(select(keys, data1))
    const applicationTotal1 = data1.applicantsTotal
    const margin = {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20
        },
        width = 380 - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom,
        outerRadius = height / 2 - 20,
        innerRadius = 0
    const legendLabels = {
        "applicantsWomen": "Female",
        "applicantsMen": "Male"
    }

    const pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        })


    const arc = d3.arc()
        .padRadius(outerRadius)
        .innerRadius(innerRadius);

    const colors = d3.scaleOrdinal()
        .domain(keys)
        .range(["#f06868", "#00bbf0"])

    const container = d3.select(".statistics").append("div").attr("class", "application")

    createPie(applicationData1, applicationTotal1)
    createCenter()
    if (compare) {
        var applicationData2 = d3.entries(select(keys, data2))
        var applicationTotal2 = data2.applicantsTotal
        createPie(applicationData2, applicationTotal2)
    }

    function createPie(applicationData, applicationTotal) {

        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        const arcs = svg.selectAll("g")
            .data(pie(applicationData))
            .enter()
            .append("g")
            .each((d) => {
                d.outerRadius = outerRadius - 20;
            })
        arcs.append("path")
            .attr("d", arc)
            .attr("fill", (d) => colors(d.data.key))
            .on("mouseover", function (d) {
                const number = d.data.value
                const info = d3.select(this.parentNode).select("text")
                info.text(number)
                    .transition()
                    .attr("font-size", 24)
                    .duration(500)
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                const number = d.data.value
                const info = d3.select(this.parentNode).select("text")
                info.text((number / applicationTotal * 100).toFixed(1) + "%")
                    .transition()
                    .ease(d3.easeBounceIn)
                    .attr("font-size", 16)
                    .duration(500)
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        arcs.append("text")
            .attr("transform", d => {
                return `translate(${arc.centroid(d)})`
            })
            .attr("fill", "white")
            .attr("font-size", 16)
            .attr("font-weight", 700)
            .attr("x", -20)
            .text(d => {
                const number = d.data.value
                return (number / applicationTotal * 100).toFixed(1) + "%"
            })

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -(height / 2 - 20))
            .attr("x", (width / 4 - 20))
            .text("Application")



        function comparison(d) {
            if (compare) {
                const compareTo = applicationData === applicationData1 ? applicationData2 : applicationData1
                const compareToApplicationTotal = applicationTotal === applicationTotal1 ? applicationTotal2 : applicationTotal1
                const {
                    key,
                    value
                } = d.data
                const compareToValue = compareTo.find(datum => datum.key === key).value
                const compareTextPercent = container.select(".comparison-data-percent")
                const compareTextNumber = container.select(".comparison-data-number")

                if (compareToValue === 0 || value === 0) {
                    compareTextPercent.text(`N/A`)
                } else {
                    const percentage = ((value / applicationTotal - compareToValue / compareToApplicationTotal) * 100).toFixed(2)
                    compareTextPercent.text(`${percentage > 0 ? "+" : ""}${percentage}%`)
                    compareTextPercent.style("fill", percentage < 0 ? "red" : "green")
                    const difference = value - compareToValue
                    compareTextNumber.text(`${difference > 0 ? "+" : ""}${difference}`)
                    compareTextNumber.style("fill", difference < 0 ? "red" : "green")
                }


                compareTextPercent.transition()
                    .duration(1000)
                    .attr("font-size", 36)

                compareTextNumber.transition()
                    .duration(1000)
                    .attr("font-size", 24)

            }

        }

        function resetComparison() {
            if (compare) {
                const numberText = container.select(".comparison-data-number")
                const percentText = container.select(".comparison-data-percent")
                numberText.text("").attr("font-size", 16)
                percentText.text("").attr("font-size", 16)
            }
        }
    }


    function createCenter() {
        const svg = container
            .append("svg")
            .attr("width", 200)
            .attr("height", height)

        // svg.selectAll("square")
        //     .data(keys)
        //     .enter()
        //     .append("rect")
        //     .attr("transform", (d, i) => {
        //         return `translate(30 ,${50 + i * 20})`
        //     })
        //     .attr("height", 20)
        //     .attr("width", 20)
        //     .style("fill", function (d) {
        //         return colors(d)
        //     })

        // svg.selectAll("label")
        //     .data(keys)
        //     .enter()
        //     .append("text")
        //     .attr("transform", (d, i) => {
        //         return `translate(60 ,${65 + i * 20})`
        //     })
        //     .text(d => legendLabels[d])

        svg.append("text")
            .attr("class", "comparison-data-percent")
            .attr("transform", (d) => {
                return `translate(50, 195)`
            })

        svg.append("text")
            .attr("class", "comparison-data-number")
            .attr("transform", (d) => {
                return `translate(50, 225)`
            })
    }
}