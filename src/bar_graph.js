import {
    select
} from "./util"
import * as d3 from "d3"
import d3Tip from "d3-tip";
d3.tip = d3Tip;

export function admissionBarChart(data1, data2) {

    const compare = data1 && data2
    const keys = ["percentAdmitted", "percentAdmittedMen", "percentAdmittedWomen"]
    const admissionData1 = d3.entries(select(keys, data1))

    const container = d3.select('.statistics .admission'),
        width = 400,
        height = 350,
        margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        }

    const x = d3.scaleBand().domain(["Total", "Men", "Women"]).range([0, width - margin.left - margin.right]).padding(.2)
    const y = d3.scaleLinear().domain([0, 100]).range([height - margin.top - margin.bottom, 0])
    const colors = d3.scaleOrdinal().domain(keys).range(["#ff8080", "#ffba92", "#c6f1d6"])
    const labels = {
        "percentAdmitted": "Total",
        "percentAdmittedMen": "Men",
        "percentAdmittedWomen": "Women"
    }

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(10)

    createChart(admissionData1)
    createCenter()
    if (compare) {

        var admissionData2 = d3.entries(select(keys, data2))
        createChart(admissionData2)
    }

    function createChart(admissionData) {
        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        const tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(d => `Admission Rate: ${d.value}%`)


        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        svg.call(tip);

        svg.selectAll("bar")
            .data(admissionData)
            .enter()
            .append("rect")
            .style("fill", d => colors(d.key))
            .attr("x", d => x(labels[d.key]))
            .attr("width", x.bandwidth() / 2)
            .attr("y", d => y(d.value))
            .attr("height", d => height - margin.top - margin.bottom - y(d.value))
            .attr("transform", `translate(${x.bandwidth() / 4}, 0)`)
            .on('mouseover', function (d) {
                tip.show(d, this)
                comparison(d)
            })
            .on('mouseout', function (d) {
                tip.hide(d, this)
                resetComparison()
            })

        // svg.append("text")
        //     .attr("text-anchor", "end")
        //     .attr("x", width)
        //     .attr("y", height + margin.top + 20)
        //     .text("X axis title");

        // svg.append("text")
        //     .attr("text-anchor", "end")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", -margin.left + 20)
        //     .attr("x", -margin.top)
        //     .text("Y axis title")

        function comparison(d) {
            if (compare) {
                const compareTo = admissionData === admissionData1 ? admissionData2 : admissionData1
                const compareToData = compareTo.find(datum => datum.key === d.key).value
                const compareText = container.select(".comparison-data")
                const difference = d.value - compareToData

                compareText.text(`${difference > 0 ? "+" : ""}${difference}%`)
                compareText.style("fill", difference < 0 ? "red" : "green")
                compareText.transition()
                    .duration(1000)
                    .attr("font-size", 36)
            }

        }

        function resetComparison() {
            if (compare) {
                const compareText = container.select(".comparison-data")
                compareText.text("").attr("font-size", 16)
            }
        }
    }

    function createCenter() {

        const svg = container
            .append("svg")
            .attr("width", 200)
            .attr("height", height)

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(50 ,195)`
            })

    }




}



export function costBarChart(data1, data2) {
    const compare = data1 && data2
    const categorizedCostData1 = [{
            category: "On Campus",
            inDistrict: data1.districtCampusPrice,
            inState: data1.inStateCampusPrice,
            outOfState: data1.outOfStateCampusPrice,

        },
        {
            category: "Off Campus",
            inDistrict: data1.districtOffCampusPrice,
            inState: data1.inStateOffCampusPrice,
            outOfState: data1.outOfStateOffCampusPrice,

        },
        {
            category: "Off Campus With Family",
            inDistrict: data1.districtOffCampusFamilyPrice,
            inState: data1.inStateOffCampusFamilyPrice,
            outOfState: data1.outOfStateOffCampusFamilyPrice,

        }
    ]



    const container = d3.select('.statistics .costs'),
        width = 400,
        height = 350,
        margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        }

    const legendLabels = {
        inDistrict: "In District",
        inState: "In State",
        outOfState: "Out of State",
    }


    const x0 = d3.scaleBand().range([0, (width - margin.left - margin.right)]).padding(.2)
    const x1 = d3.scaleBand()
    const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
    const colors = d3.scaleOrdinal().range(["#ff8080", "#ffba92", "#c6f1d6"])

    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y).ticks(10)

    x0.domain(categorizedCostData1.map(d => d.category))
    x1.domain(['inDistrict', 'inState', "outOfState"]).range([0, x0.bandwidth()])
    y.domain([0, 100000])

    createGroupedBarChart(categorizedCostData1)
    createCenter()
    if (compare) {
        var categorizedCostData2 = [{
                category: "On Campus",
                inDistrict: data2.districtCampusPrice,
                inState: data2.inStateCampusPrice,
                outOfState: data2.outOfStateCampusPrice,

            },
            {
                category: "Off Campus",
                inDistrict: data2.districtOffCampusPrice,
                inState: data2.inStateOffCampusPrice,
                outOfState: data2.outOfStateOffCampusPrice,

            },
            {
                category: "Off Campus With Family",
                inDistrict: data2.districtOffCampusFamilyPrice,
                inState: data2.inStateOffCampusFamilyPrice,
                outOfState: data2.outOfStateOffCampusFamilyPrice,

            }
        ]
        createGroupedBarChart(categorizedCostData2)
    }

    function createGroupedBarChart(categorizedCostData) {
        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const categories = svg.selectAll(".category")
            .data(categorizedCostData)
            .enter().append("g")
            .attr("class", "category")
            .attr("transform", d => `translate(${x0(d.category)},0)`);

        categories.selectAll(".bar.in-district")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar in-district")
            .style("fill", (d) => colors(0))
            .attr("x", d => x1('inDistrict'))
            .attr("y", d => y(d.inDistrict))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d.inDistrict))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })


        categories.selectAll(".bar.in-state")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar in-state")
            .style("fill", colors(1))
            .attr("x", d => x1('inState'))
            .attr("y", d => y(d.inState))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d.inState))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        categories.selectAll(".bar.out-of-state")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar out-of-state")
            .style("fill", colors(2))
            .attr("x", d => x1('outOfState'))
            .attr("y", d => y(d.outOfState))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d.outOfState))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        categories.append("text").text(d => {
                return "$" + d.inDistrict
            })
            .attr("transform", function (d) {
                const xCoord = x1("inDistrict")
                const yCoord = y(d.inDistrict)
                return `translate(${xCoord + 20},${yCoord - 5}) rotate(-90)`
            })

        categories.append("text").text(d => {
                return "$" + d.inState
            })
            .attr("transform", function (d) {
                const xCoord = x1("inState")
                const yCoord = y(d.inState)
                return `translate(${xCoord + 20},${yCoord - 5}) rotate(-90)`
            })

        categories.append("text").text(d => {
                return "$" + d.outOfState
            })
            .attr("transform", function (d) {
                const xCoord = x1("outOfState")
                const yCoord = y(d.outOfState)
                return `translate(${xCoord + 20},${yCoord - 5}) rotate(-90)`
            })

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);


        function comparison(d) {
            if (compare) {
                const compareTo = categorizedCostData === categorizedCostData1 ? categorizedCostData2 : categorizedCostData1
                const compareToData = compareTo.find(datum => datum.category === d.category)
                const dArr = Object.entries(d).slice(1),
                    compareToArr = Object.values(compareToData).slice(1)
                const texts = container.selectAll(".comparison-data").nodes()
                dArr.forEach(([key, value], idx) => {
                    const compareToValue = compareToArr[idx]
                    let percentage = value - compareToValue
                    percentage >= 0 ? percentage = (percentage / compareToValue * 100).toFixed(2) : percentage = (percentage / value * 100).toFixed(2)
                    texts[idx].innerHTML = `${legendLabels[key]}:  ${percentage}%`
                    texts[idx].style.fill = `${percentage < 0 ? "red" : "green"}`
                })
            }

        }

        function resetComparison() {
            if (compare) {
                const texts = container.selectAll(".comparison-data").nodes()
                for (let text of texts) {
                    text.innerHTML = ""
                }
            }
        }
    }

    function createCenter() {

        const svg = container
            .append("svg")
            .attr("width", 200)
            .attr("height", height)

        svg.selectAll("square")
            .data(Object.keys(legendLabels))
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
            .data(Object.values(legendLabels))
            .enter()
            .append("text")
            .attr("transform", (d, i) => {
                return `translate(60 ,${65 + i * 20})`
            })
            .text(d => d)

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,165)`
            })

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,195)`
            })

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,225)`
            })

    }

}




export function SATBarChart(data1, data2) {

    const compare = data1 && data2
    const {
        SATReading25,
        SATReading75,
        SATMath25,
        SATMath75,
    } = data1

    const categorizedSATData1 = [{
            category: "25th Percentile",
            math: SATMath25,
            reading: SATReading25
        },
        {
            category: "75th Percentile",
            math: SATMath75,
            reading: SATReading75
        }
    ]

    const container = d3.select('.statistics .sat'),
        width = 400,
        height = 350,
        margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        }


    const x0 = d3.scaleBand().range([0, (width - margin.left - margin.right)]).padding(.2)
    const x1 = d3.scaleBand()
    const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
    const colors = d3.scaleOrdinal().domain(["math", "reading"]).range(["#ff8080", "#ffba92"])

    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y).ticks(8)

    x0.domain(categorizedSATData1.map(d => d.category))
    x1.domain(['math', 'reading']).range([0, x0.bandwidth()])
    y.domain([0, 800])

    createBarChart(categorizedSATData1)
    createCenter()
    if (compare) {
        const {
            SATReading25,
            SATReading75,
            SATMath25,
            SATMath75,
        } = data2
        var categorizedSATData2 = [{
                category: "25th Percentile",
                math: SATMath25,
                reading: SATReading25
            },
            {
                category: "75th Percentile",
                math: SATMath75,
                reading: SATReading75
            }
        ]
        createBarChart(categorizedSATData2)
    }

    function createBarChart(categorizedSATData) {
        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const categories = svg.selectAll(".category")
            .data(categorizedSATData)
            .enter().append("g")
            .attr("class", "category")
            .attr("transform", d => `translate(${x0(d.category)},0)`);

        categories.selectAll(".bar.math")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar math")
            .style("fill", (d) => colors('math'))
            .attr("x", d => x1('math'))
            .attr("y", d => y(d.math))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d.math))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        categories.selectAll(".bar.reading")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar reading")
            .style("fill", (d) => colors("reading"))
            .attr("x", d => x1('reading'))
            .attr("y", d => y(d.reading))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d.reading))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        categories.append("text").text(d => {
                return d.reading
            })
            .attr("transform", function (d) {
                const xCoord = x1("reading")
                const yCoord = y(d.reading)
                return `translate(${xCoord + 20}, ${yCoord + 20})`
            })
            .attr("font-weight", 700)
            .style("fill", "white")


        categories.append("text").text(d => {
                return d.math
            })
            .attr("transform", function (d) {
                const xCoord = x1("math")
                const yCoord = y(d.math)
                return `translate(${xCoord + 20}, ${yCoord + 20})`
            })
            .attr("font-weight", 700)
            .style("fill", "white")


        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);


        function comparison(d) {
            if (compare) {
                const compareTo = categorizedSATData === categorizedSATData1 ? categorizedSATData2 : categorizedSATData1
                const compareToData = compareTo.find(datum => datum.category === d.category)
                const dArr = Object.entries(d).slice(1),
                    compareToArr = Object.values(compareToData).slice(1)
                const texts = container.selectAll(".comparison-data").nodes()
                dArr.forEach(([key, value], idx) => {
                    const compareToValue = compareToArr[idx]
                    const number = value - compareToValue
                    texts[idx].innerHTML = `${["Math", "Reading"][idx]}:  ${number > 0? "+" + number : number}`
                    texts[idx].style.fill = `${number < 0 ? "red" : "green"}`
                })
            }

        }

        function resetComparison() {
            if (compare) {
                const texts = container.selectAll(".comparison-data").nodes()
                for (let text of texts) {
                    text.innerHTML = ""
                }
            }
        }

    }




    function createCenter() {

        const svg = container
            .append("svg")
            .attr("width", 200)
            .attr("height", height)

        svg.selectAll("square")
            .data(["math", "reading"])
            .enter()
            .append("rect")
            .attr("transform", (d, i) => {
                return `translate(30 ,${50 + i * 20})`
            })
            .attr("height", 20)
            .attr("width", 20)
            .style("fill", d => colors(d))

        svg.selectAll("label")
            .data(["Math", "Reading"])
            .enter()
            .append("text")
            .attr("transform", (d, i) => {
                return `translate(60 ,${65 + i * 20})`
            })
            .text(d => d)

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,165)`
            })

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,195)`
            })
    }

}



export function ACTBarChart(data1, data2) {

    const compare = data1 && data2

    const {
        ACTComposite25,
        ACTComposite75,
        ACTEnglish25,
        ACTEnglish75,
        ACTMath25,
        ACTMath75,
    } = data1



    const categorizedACTData1 = [{
            category: "25th Percentile",
            composite: ACTComposite25,
            math: ACTMath25,
            english: ACTEnglish25
        },
        {
            category: "75th Percentile",
            composite: ACTComposite75,
            math: ACTMath75,
            english: ACTEnglish75
        }
    ]

    const container = d3.select('.statistics .act'),
        width = 400,
        height = 350,
        margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        }




    const x0 = d3.scaleBand().range([0, (width - margin.left - margin.right)]).padding(.2)
    const x1 = d3.scaleBand()
    const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
    const colors = d3.scaleOrdinal().domain(["composite", "math", "english"]).range(["red", "#ff8080", "#ffba92"])

    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y)



    x0.domain(categorizedACTData1.map(d => d.category))
    x1.domain(["composite", 'math', 'english']).range([0, x0.bandwidth()])
    y.domain([0, 36])

    createBarChart(categorizedACTData1)
    createCenter()
    if (compare) {
        const {
            ACTComposite25,
            ACTComposite75,
            ACTEnglish25,
            ACTEnglish75,
            ACTMath25,
            ACTMath75,
        } = data2

        var categorizedACTData2 = [{
                category: "25th Percentile",
                composite: ACTComposite25,
                math: ACTMath25,
                english: ACTEnglish25
            },
            {
                category: "75th Percentile",
                composite: ACTComposite75,
                math: ACTMath75,
                english: ACTEnglish75
            }
        ]
        createBarChart(categorizedACTData2)
    }

    function createBarChart(categorizedACTData) {

        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const categories = svg.selectAll(".category")
            .data(categorizedACTData)
            .enter().append("g")
            .attr("class", "category")
            .attr("transform", d => `translate(${x0(d.category)},0)`);

        categories.selectAll(".bar.composite")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar composite")
            .style("fill", (d) => colors('composite'))
            .attr("x", d => x1('composite'))
            .attr("y", d => y(d.composite))
            .attr("width", x1.bandwidth())
            .attr("height", d => (height - margin.top - margin.bottom - y(d.composite)))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        categories.selectAll(".bar.math")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar math")
            .style("fill", (d) => colors('math'))
            .attr("x", d => x1('math'))
            .attr("y", d => y(d.math))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d.math))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        categories.selectAll(".bar.english")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar english")
            .style("fill", (d) => colors("english"))
            .attr("x", d => x1('english'))
            .attr("y", d => y(d.english))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d.english))
            .on("mouseover", function (d) {
                d3.select(this).style("opacity", 0.8)
                comparison(d)
            })
            .on("mouseout", function (d) {
                d3.select(this).style("opacity", 1)
                resetComparison()
            })

        categories.append("text").text(d => {
                return d.composite
            })
            .attr("transform", function (d) {
                const xCoord = x1("composite")
                const yCoord = y(d.composite)
                return `translate(${xCoord + 12},${yCoord + 20})`
            })
            .attr("font-weight", 700)
            .style("fill", "white")

        categories.append("text").text(d => {
                return d.math
            })
            .attr("transform", function (d) {
                const xCoord = x1("math")
                const yCoord = y(d.math)
                return `translate(${xCoord + 12},${yCoord + 20})`
            })
            .attr("font-weight", 700)
            .style("fill", "white")

        categories.append("text").text(d => {
                return d.english
            })
            .attr("transform", function (d) {
                const xCoord = x1("english")
                const yCoord = y(d.english)
                return `translate(${xCoord + 12},${yCoord + 20})`
            })
            .attr("font-weight", 700)
            .style("fill", "white")



        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        function comparison(d) {
            if (compare) {
                const compareTo = categorizedACTData === categorizedACTData1 ? categorizedACTData2 : categorizedACTData1
                const compareToData = compareTo.find(datum => datum.category === d.category)
                const dArr = Object.entries(d).slice(1),
                    compareToArr = Object.values(compareToData).slice(1)
                const texts = container.selectAll(".comparison-data").nodes()
                dArr.forEach(([key, value], idx) => {
                    const compareToValue = compareToArr[idx]
                    const number = value - compareToValue
                    texts[idx].innerHTML = `${["Composite", "Math", "Reading"][idx]}:  ${number > 0? "+" + number : number}`
                    texts[idx].style.fill = `${number < 0 ? "red" : "green"}`
                })
            }

        }

        function resetComparison() {
            if (compare) {
                const texts = container.selectAll(".comparison-data").nodes()
                for (let text of texts) {
                    text.innerHTML = ""
                }
            }
        }
    }




    function createCenter() {

        const svg = container
            .append("svg")
            .attr("width", 200)
            .attr("height", height)


        svg.selectAll("square")
            .data(["composite", "math", "english"])
            .enter()
            .append("rect")
            .attr("transform", (d, i) => {
                return `translate(30 ,${50 + i * 20})`
            })
            .attr("height", 20)
            .attr("width", 20)
            .style("fill", d => colors(d))

        svg.selectAll("label")
            .data(["Composite",
                "Math", "English"
            ])
            .enter()
            .append("text")
            .attr("transform", (d, i) => {
                return `translate(60 ,${65 + i * 20})`
            })
            .text(d => d)


        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,165)`
            })

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,195)`
            })

        svg.append("text")
            .attr("class", "comparison-data")
            .attr("transform", (d) => {
                return `translate(30 ,225)`
            })
    }
    
}