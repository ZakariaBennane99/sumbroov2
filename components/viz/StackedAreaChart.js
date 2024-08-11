import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const StackedAreaChart = ({ data, metrics, metricDisplayName, colorScheme, screenWidth }) => {

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    console.log(showTooltip)
    setShowTooltip(true);
    setTimeout(console.log(showTooltip), 2000)

  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const [checkStatus, setCheckStatus] = useState({
    insta: true,
    faceb: true
  });

  const handleCheckmarkClick = (e) => {
    const platform = e.target.getAttribute('data-platform')
    setCheckStatus((prev) => ({
        ...prev,
        [platform]: !prev[platform]
    }))
  };

  const ref = useRef();

  /* ONLY FOR MULTIPLE PLATFORMS
  useEffect(() => {
    setPlatform(checkStatus)
  }, [checkStatus]);
  */

  useEffect(() => {

    const svg = d3.select(ref.current);

    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 450 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const stack = d3.stack().keys(metrics);
    const stackedData = stack(data);

    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))]);

    const area = d3.area()
      .x(d => x(d.data.date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveCardinal);

    const colors = d3.scaleOrdinal(colorScheme); // Use user-defined color scheme

    // Create a div for the tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "StackedAreaChart-tooltip")
      .style("opacity", 0);

    function month(m) {
      const months = ['Jan', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[m];
    }

    stackedData.forEach((d, i) => {
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient" + i) // unique id for each gradient
        .attr("gradientTransform", "rotate(90)");
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colors(i))
        .attr("stop-opacity", 0.2);
    });

    const line = d3.line()
      .x(d => x(d.data.date))
      .y(d => y(d[1]))
      .curve(d3.curveCardinal);

    // Add the mouseover and mouseout events to the paths
    g.selectAll('path')
      .data(stackedData)
      .enter().append('path')
      .attr('fill', (d, i) => "url(#gradient" + i + ")")
      .attr('d', area)
      .on('mouseover', function (event, d, i) {
        d3.select(this)
          .style('opacity', 0.8) // Change opacity on hover on hover
        // Add your tooltip logic here
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(metricDisplayName[d.index])
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .style("padding", '5px')
          .style("color", 'white')
          .style("background-color", colorScheme)
          .style('text-align', 'start')
          .style('width', '120px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .style('opacity', 1) // Reset opacity on mouseout
          .attr('stroke', 'none'); // Reset stroke color on mouseout

        // Hide the tooltip
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add the top lines
    g.selectAll('.top-line')
      .data(stackedData)
      .enter().append('path')
      .attr('class', 'top-line')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => colors(i)) // Set stroke color here
      .attr('stroke-width', '2px') // Set stroke width here
      .attr('d', line);

    // Define the x-axis with the desired date formatting
    let formatTime = d3.timeFormat("%b %d");
    let xAxis = d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(formatTime);

    let xAxisG = g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Change color of x-axis text
    xAxisG.selectAll("text")
      .style("fill", "#1c1c57");

    // Change color of x-axis line
    xAxisG.selectAll("line")
      .style("stroke", "#1c1c57");

    xAxisG.select(".domain")
      .style("stroke", "#1c1c57");

    // Create y-axis
    let yAxisG = g.append("g")
      .call(d3.axisLeft(y));

    // Change color of y-axis text
    yAxisG.selectAll("text")
      .style("fill", "#1c1c57");

    // Change color of y-axis line
    yAxisG.selectAll("line")
      .style("stroke", "#1c1c57");

    yAxisG.select(".domain")
      .style("stroke", "#1c1c57");

    // create a point highlights
    stackedData.forEach((serie, i) => {
      g.selectAll(".circle" + i)
        .data(serie)
        .enter().append('circle')
        .attr('class', 'dataCircle')
        .attr('cx', d => x(d.data.date))
        .attr('cy', d => y(d[1]))
        .attr('r', 4)
        .attr('fill', colors(i))
        .on('click', function (event, d) {
          console.log(d);
        })
        .on("mouseover", function (event, d) { // Add this event listener
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html("Date: " + month(d.data.date.getMonth()) + " " + d.data.date.getDate()
            + ", " + d.data.date.getFullYear() + "<br/>" + "Value: " + d[1])
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("background-color", colorScheme)
            .style("padding", '5px')
            .style("color", 'white')
            .style('text-align', 'start')
            .style('width', 'fit-content');
        })
        .on("mouseout", function (d) { // Add this event listener
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });

    return () => {
      svg.selectAll("*").remove();
    }

  }, [data, metrics, colorScheme, metricDisplayName]);

  return (
    <div className='stackedAreaChart'>
      <div className='topArea'>
        <div className='title'>Total Post Engagements</div>
        <div className="question-mark-container">
            <div
              className="question-mark"
              onMouseOver={handleMouseEnter}
              onMouseOut={handleMouseLeave}
            >
              ?
            </div>
            {showTooltip ? <div className="graphInfoTooltip">
            This is a Stacked Area Chart. For multiple engagements, the combined area represents the total engagement from all the selected platforms.
            For example, If you have 200 engagements on Facebook and 100 on Instagram, the stacked area chart will show
            a combined area of 300, representing the cumulative engagement.
            </div> : ''}
          </div>
      </div>
      <svg ref={ref} width="450px" height="300px"></svg>
    </div>
  );
};

export default StackedAreaChart;


/*

Checkmark for multiple platforms

        <div className="checkmarks-wrapper">
          <div className="checkmark">
            <span className="checkmark-icon" data-platform='insta' dangerouslySetInnerHTML={{ __html: checkStatus.insta ? '&#10004;' : '' }}
             onClick={handleCheckmarkClick} style={{
              backgroundColor: checkStatus.insta ? '#F56040' : '',
              opacity: 0.9,
              border: `2px solid #F56040`
            }} />
            <span className="checkmark-label">Instagram</span>
          </div>
          <div className="checkmark" >
          <span className="checkmark-icon" data-platform='faceb' dangerouslySetInnerHTML={{ __html: checkStatus.faceb ? '&#10004;' : '' }}
             onClick={handleCheckmarkClick} style={{
              backgroundColor: checkStatus.faceb ? '#4267B2' : '',
              opacity: 0.9,
              border: `2px solid #4267B2`
            }} />
            <span className="checkmark-label">Facebook</span>
          </div>
        </div>

*/
