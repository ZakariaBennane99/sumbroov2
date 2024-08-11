import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';

const MultiLineChart = ({ data, setConversionData }) => { 

  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
  
    function handleResize() {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }
  
    handleResize(); // initial call
  
    window.addEventListener('resize', handleResize);
  
    return () => {
        window.removeEventListener('resize', handleResize);
    }
  
  }, []);
  
  const ref = useRef();
  
  const [targetMetrics, setTargetMetrics] = useState(null);
  
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  
  const options = [
    { value: 'Impressions (# of times your pin was on-screen)', label: 'Impressions (# of times your pin was on-screen)' },
    { value: 'Pin saves', label: 'Pin saves' },
    { value: 'Destination link clicks', label: 'Destination Link Clicks' }
  ];
  
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#1c1c57',
    })
  };
  
  function handleMetrics(selectedOptions) {
    setTargetMetrics(selectedOptions)
  }
  
  useEffect(() => {
    setConversionData(targetMetrics)
  }, [targetMetrics]);
  
  
  useEffect(() => {
  
    const aspectRatioWidth = 2;
    const aspectRatioHeight = 1;
  
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = (containerWidth - 30) - margin.left - margin.right;
    const height = ((containerWidth / aspectRatioWidth) * aspectRatioHeight) - margin.top - margin.bottom;
  
    const svg = d3
      .select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Create a div for the tooltip
    const tooltip = d3.select(ref.current.parentNode)
      .append('div')
      .style('width', '150px')
      .style('height', 'fit-content')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#8383a4')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '3px');
  
    const xScale = d3.scaleTime()
    // data.map((d) => d.day) instead of d3.extent...
      .domain(d3.extent(data.map((d) => d.day)))
      .range([0, width]);
  
    // Get all platforms and metrics from the data
    const platforms = Object.keys(data[0]).filter(key => key !== 'day'); // swap day for day
    const metrics = platforms.reduce((acc, platform) => {
      return { ...acc, [platform]: Object.keys(data[0][platform]) };
    }, {});
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => {
        // Get the maximum value across all platforms and metrics
        return Math.max(...platforms.map(platform => {
          return Math.max(...metrics[platform].map(metric => d[platform][metric]));
        }));
      })])
      .range([height, 0]);
  
    const lineGenerator = platform => metric => d3.line()
      .x(d => xScale(d.day)) // d.day
      .y(d => yScale(d[platform][metric]));
  
    const colorMapping = {
      'Impressions (# of times your pin was on-screen)': '#1f77b4',
      'Pin saves': '#ff7f0e',
      'Destination link clicks': '#d62728',
    };
      
  
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%b %e"))
    .tickValues(data.map(d => d.day))); // d.day
  
    svg.append("g")
      .call(d3.axisLeft(yScale));
  
    platforms.forEach(function (platform, platformIdx) {
      metrics[platform].forEach(function (metric, metricIdx) {
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", colorMapping[metric])
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", lineGenerator(platform)(metric));
  
        // Add circles (data points)
        svg.selectAll(`.dot-${platform}-${metric.replace(/\s/g, '-').replace(/[()]/g, '')}`)
        .data(data)
        .enter().append("circle")
        .attr("class", `dot-${platform}-${metric.replace(/\s/g, '-').replace(/[()]/g, '')}`)
          .attr("cx", d => xScale(d.day)) // d.day
          .attr("cy", d => yScale(d[platform][metric]))
          .attr("r", 3)
          .style("fill", colorMapping[metric])
          .on("mouseover", function (event, d) {
            // Show tooltip on mouseover
            const fillColor = d3.select(this).style('fill');
            tooltip.style('visibility', 'visible')                                   // below just d.day
              .html(`${metric}<br>Value: <b>${d[platform][metric]}</b><br>Date: <b>${d.day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</b>`)
              .style('top', `${event.pageY - 10}px`)
              .style('font-size', '1.1em')
              .style('visibility', 'visible')
              .style('padding', '6px')
              .style("border", "2px solid " + fillColor)
              .style("font-family", 'IBM Plex Sans')
              .style('background', 'white')
              .style("color", '#1c1c57')
              .style("box-shadow", '0px 0 2px 0.5px ' + fillColor)
              svg.append("circle")
                .attr("class", "halo")
                .attr("cx", xScale(d.day))  // d.day
                .attr("cy", yScale(d[platform][metric]))
                .attr("r", 6)
                .style("fill", colorMapping[metric])
                .style("opacity", 0.3)

              const tooltipWidth = tooltip.node().getBoundingClientRect().width;
              tooltip.style('left', `${event.pageX - tooltipWidth - 10}px`);   
          })
          .on("mouseout", function () {
            // Hide tooltip on mouseout
            tooltip.style('visibility', 'hidden');
            svg.selectAll(".halo").remove();
          });
      });
    });
  
  
    // cleanup funtion
    return () => {
      svg.selectAll("*").remove();
    }
  
  }, [data, containerWidth]);
  
  return (
    <div ref={containerRef} className='multiLineChart'>
        <div className='topArea'>
          <div className='interactive'>
            <div className='title'>Conversions Graph</div>
            <div className="question-mark-container">
                <div
                  className="question-mark"
                  onMouseOver={handleMouseEnter}
                  onMouseOut={handleMouseLeave}
                >
                  ?
                </div>
                    {showTooltip ? <div className="graphInfoTooltip">
                    This graph provides a comprehensive view of your pin&apos;s performance. It allows you to track key metrics such as website clicks and new followers, all in one place. By comparing these metrics with the total impressions, you can easily gauge the effectiveness of your pin in driving your desired outcomes. Whether your goal is to increase website traffic or grow your follower base, this graph offers valuable insights into your conversion rates.
                </div> : ''}
            </div>
          </div> 
          <Select
            value={targetMetrics}
            onChange={handleMetrics}
            options={options}
            isMulti
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            styles={ customStyles }
            theme={(theme) => ({
                ...theme,
                colors: {
                ...theme.colors,
                  primary25: '#e8e8ee',  // color of the option when hovering
                  primary: '#1c1c57',  // color of the selected option
                },
            })}
            placeholder='Select Metric/Metrics'
          /> 
        </div>
        <svg ref={ref}></svg>
    </div>
  )
}

export default MultiLineChart;