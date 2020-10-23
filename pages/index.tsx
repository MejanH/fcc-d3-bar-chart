import Head from "next/head";
import * as d3 from "d3";
import { useEffect } from "react";

export default function Home() {
  let width = 1200;
  let height = 400;
  let barWidth = width / 275;

  useEffect(() => {
    var tooltip = d3
      .select(".visHolder")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    let overlay = d3
      .select(".visHolder")
      .append("div")
      .attr("class", "overlay")
      .style("opactiy", 0);

    let svgContainer = d3
      .select(".visHolder")
      .append("svg")
      .attr("width", width + 100)
      .attr("height", height + 60);

    d3.json(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    ).then((data) => {
      let years = data.data.map((item) => {
        let quarter;
        let temp = item[0].substring(5, 7);

        if (temp === "01") {
          quarter = "Q1";
        } else if (temp === "04") {
          quarter = "Q2";
        } else if (temp === "07") {
          quarter = "Q3";
        } else if (temp === "10") {
          quarter = "Q4";
        }

        return item[0].substring(0, 4) + " " + quarter;
      });

      let yearsDate = data.data.map((item) => {
        return new Date(item[0]);
      });

      let xMax = new Date(d3.max(yearsDate));

      // just increased the max value
      xMax.setMonth(xMax.getMonth() + 3);

      let xScale = d3
        .scaleTime()
        .domain([d3.min(yearsDate), xMax])
        .range([0, width]);

      let xAxis = d3.axisBottom().scale(xScale);

      svgContainer
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(60,400)"); // translate from its current position with x,y axis

      let GDP = data.data.map((item) => {
        return item[1];
      });

      let scaledGDP = [];
      let gdpMax = d3.max(GDP);

      let linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

      scaledGDP = GDP.map((item) => {
        return linearScale(item);
      });

      let yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

      let yAxis = d3.axisLeft().scale(yAxisScale);

      svgContainer
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(60,0)");

      d3.select("svg")
        .selectAll("rect")
        .data(scaledGDP)
        .enter()
        .append("rect")
        .attr("data-date", function (d, i) {
          return data.data[i][0];
        })
        .attr("data-gdp", function (d, i) {
          return data.data[i][1];
        })
        .attr("class", "bar")
        .attr("x", function (d, i) {
          return xScale(yearsDate[i]);
        })
        .attr("y", function (d, i) {
          return height - d;
        })
        .attr("width", barWidth)
        .attr("height", function (d) {
          return d;
        })
        .style("fill", "teal")
        .attr("transform", "translate(60,0)")
        .on("mouseover", function (event, d) {
          const e = d3.selectAll("rect").nodes();
          const i = e.indexOf(this);
          tooltip.style("opacity", 0.9);
          tooltip
            .html(years[i] + "<br>" + "$" + GDP[i] + " Billion")
            .attr("data-date", data.data[i][0])
            .style("position", "relative")
            .style("background-color", "orange")
            .style("width", "200px")
            .style("left", event.pageX - 50 + "px")
            .style("top", event.pageY + "px");
        })
        .on("mouseout", function () {
          tooltip.style("opacity", 0);
        });

      d3.selectAll(".bar");
    });
  }, []);
  return (
    <div>
      <Head>
        <title>FCC: D3 Bar Chart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 id="title">D3 Bar Chart</h1>
        <div className="visHolder"></div>
      </main>

      <footer className="footer">
        <p className="footer-text">
          by <strong>Muhammad Mejanul Haque</strong>
        </p>
      </footer>
    </div>
  );
}
