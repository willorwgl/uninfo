import * as d3 from "d3"


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

export function viewSetup(universityName) {
    const data = statistics.find((university) => {
        return university.universityName === universityName
    })
    costBarChart(data)
    enrollmentRaceDiversity(data)
    application(data)
    enrollment(data)
}

function costBarChart(data) {

    const categorizedCostData = [{
            category: "On Campus",
            inDistrict: data.districtCampusPrice,
            inState: data.inStateCampusPrice,
            outOfState: data.outOfStateCampusPrice,

        },
        {
            category: "Off Campus",
            inDistrict: data.districtOffCampusPrice,
            inState: data.inStateOffCampusPrice,
            outOfState: data.outOfStateOffCampusPrice,

        },
        {
            category: "Off Campus With Family",
            inDistrict: data.districtOffCampusFamilyPrice,
            inState: data.inStateOffCampusFamilyPrice,
            outOfState: data.outOfStateOffCampusFamilyPrice,

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
    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(.2)
    const x1 = d3.scaleBand()
    const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
    const color = d3.scaleOrdinal().range(["#eb7070", "#fec771", "#64e291"])

    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y).ticks(10)

    x0.domain(categorizedCostData.map(d => d.category))
    x1.domain(['inDistrict', 'inState', "outOfState"]).range([0, x0.bandwidth()])
    y.domain([0, 100000])

    const categories = svg.selectAll(".category")
        .data(categorizedCostData)
        .enter().append("g")
        .attr("class", "category")
        .attr("transform", d => `translate(${x0(d.category)},0)`);

    const t = d3.transition()
        .duration(750);

    categories.selectAll(".bar.in-district")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar in-district")
        .style("fill", (d) => color(0))
        .attr("x", d => x1('inDistrict'))
        .attr("y", d => y(d.inDistrict))
        .attr("width", x1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - y(d.inDistrict)
        })

        .on("mouseover", function (d) {
            d3.select(this).style("fill", d3.rgb(color(0)).darker(1))
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", color(0))
        })

    categories.selectAll(".bar.in-state")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar in-state")
        .style("fill", color(1))
        .attr("x", d => x1('inState'))
        .attr("y", d => y(d.inState))
        .attr("width", x1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - y(d.inState)
        })
        .on("mouseover", function (d) {
            d3.select(this).style("fill", d3.rgb(color(1)).darker(1))
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", color(1))
        })

    categories.selectAll(".bar.out-of-state")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar out-of-state")
        .style("fill", color(2))
        .attr("x", d => x1('outOfState'))
        .attr("y", d => y(d.outOfState))
        .attr("width", x1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - y(d.outOfState)
        })
        .on("mouseover", function (d) {
            d3.select(this).style("fill", d3.rgb(color(2)).darker(1))
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", color(2))
        })


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}



function enrollmentGenderDiversity() {

}


function admission(data) {
    // const keys = ["percentAdmitted", "percentAdmittedMen", "percentAdmittedWomen"]

    // percentAdmitted, percentAdmittedMen, percentAdmittedWomen
    //  admissionsTotal, admissionMen, admissionsWomen,
    // const admissionData
    // //pie chart
    // // male vs female %
}


function application(data) {
    const keys = ["applicantsMen", "applicantsWomen"]
    const applicationData = select(keys, data)
    const margin = {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20
        },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        outerRadius = height / 2 - 20,
        innerRadius = 0

    const dataReady = d3.entries(applicationData)
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
        .range(["#00b8a9", "#f8f3d4"])


    const svg = d3.select(".statistics .admission").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.selectAll("path")
        .data(pie(dataReady))
        .enter()
        .append("path")
        .each((d) => {
            d.outerRadius = outerRadius - 20;
        })
        .attr("d", arc)
        .attr("fill", (d) => colors(d.data.key))
}

function enrollment(data) {
    const keys = ["enrolledMen", "enrolledWomen"]

    const enrollmentData = select(keys, data)
    const margin = {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20
        },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        outerRadius = height / 2 - 20,
        innerRadius = 0
    debugger
    const dataReady = d3.entries(enrollmentData)
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
        .range(["#00b8a9", "#f8f3d4", "red"])


    const svg = d3.select(".statistics .enrollment").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.selectAll("path")
        .data(pie(dataReady))
        .enter()
        .append("path")
        .each((d) => {
            d.outerRadius = outerRadius - 20;
        })
        .attr("d", arc)
        .attr("fill", (d) => colors(d.data.key))
}





function enrollmentRaceDiversity(data) {
    const keys = ["percentEnrolledAIAN", "percentEnrolledA", "percentEnrolledNHPI", "percentEnrollBAA",
        "percentEenrolledHL", "percentEnrolledW", "percentEnrolledU", "percentEnrolledNA", "percentEnrolledM"
    ]
    const diversityData = select(keys, data)
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

    const dataReady = d3.entries(diversityData)
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


    const svg = d3.select(".statistics").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.selectAll("path")
        .data(pie(dataReady))
        .enter()
        .append("path")
        .each((d) => {
            d.outerRadius = outerRadius - 20;
        })
        .attr("d", arc)
        .attr("fill", (d) => colors(d.data.key))
        .on("mouseover", arcTween(outerRadius, 0))
        .on("mouseout", arcTween(outerRadius - 20, 150));

    const centerRadius = innerRadius * 0.8
    svg.append("svg:circle")
        .attr("r", centerRadius)
        .style("fill", "#E7E7E7")


    svg.append("text")
        .text("Diversity")
        .attr('class', 'center-text')
        .attr("transform", `translate(-${centerRadius / 3},-${centerRadius / 3})`)

    svg.append("text")
        .attr('class', 'center-stats-text')
        .attr("transform", `translate(-${centerRadius / 4}, ${centerRadius / 4})`)


    function arcTween(outerRadius, delay) {
        return function (d) {
            d3.select(".center-stats-text").text(d.data.value + "%")
            d3.select(this).transition().delay(delay).attrTween("d", function (d) {
                const i = d3.interpolate(d.outerRadius, outerRadius);
                return function (t) {
                    d.outerRadius = i(t);
                    return arc(d);
                };
            });
        };
    }

}

function select(keys = [], obj = {}) {
    const selected = {}
    for (let key of keys) {
        selected[key] = obj[key]
    }
    return selected
}