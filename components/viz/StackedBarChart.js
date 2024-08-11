import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';

const StackedBarChart = ({ data, setEngagementData }) => {

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

  const [targetMetrics, settargetMetrics] = useState(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  function handleMetrics(selectedOptions) {
    settargetMetrics(selectedOptions)
  }

  const chartRef = useRef();

  function getMetricInfo(key, val, totalVal) {
    const keyCapitalized = key.charAt(0).toUpperCase() + key.slice(1)
    return keyCapitalized + ': <b>' + val + '</b>' + '</br> % of ' + key + ': <b>' + ((val/totalVal*100).toFixed(2)) + '%' + '</b>' + '<br/>' + 'Total impressions: ' + '<b>' + totalVal + '</b>'
  }

  const options = [
    { value: 'destination link clicks', label: 'Destination Link Clicks' },
    { value: 'saves', label: 'Saves' },
    { value: 'reactions', label: 'Reactions' },
    { value: 'pin enlargement clicks', label: 'Pin Enlargement Clicks' },
    { value: 'video start clicks', label: 'Video Start Clicks' },
    { value: 'unengaged impressions', label: 'Unengaged Impressions'}
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

  useEffect(() => {
    setEngagementData(targetMetrics)
  }, [targetMetrics]);

  useEffect(() => {

    const aspectRatioWidth = 19;
    const aspectRatioHeight = 15;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = containerWidth - 30 - margin.left - margin.right;
    const height = ((containerWidth / aspectRatioWidth) * aspectRatioHeight) - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const categories = ['destination link clicks', 'saves', 'reactions', 'pin enlargement clicks', 'video start clicks', 'unengaged impressions', 'other'];

    const x = d3.scaleBand().domain(data.map((d) => d.day)).range([0, width]).padding(0.22);
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d3.sum(categories, (c) => d[c]))]).range([height, 0]); // #0000FF

    const color = d3.scaleOrdinal().domain(categories).range(['#f4a261', '#ef233c','#264653' , '#2a9d8f', '#8d99ae', '#c2c2c2', '#1c1c57']);
    
    const stack = d3.stack().keys(categories);
    const stackedData = stack(data);

    const tooltip = d3.select("body").append("div")
    .attr("class", "StackedBarChart-tooltip")
    .style("opacity", 0);

    svg
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', (d) => color(d.key))
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.data.day))
    .attr('y', (d) => y(d[1]))
    .attr('height', (d) => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth())
    .on('mouseover', function (event, d, i) {
      const key = this.parentNode.__data__.key
      const val = d[1] - d[0]
      d3.select(this)
        .style('opacity', 0.8);
      // Add your tooltip logic here
      tooltip.transition()
        .duration(200)
        .style('opacity', 1)
        .style('font-size', '1em');
      const fillColor = d3.select(this).style('fill');
      tooltip.html(getMetricInfo(key, val, d.data.impressions))
        .style('top', `${event.pageY - 10}px`)
        .style("padding", '5px')
        .style("color", '#1c1c57')
        .style("font-family", 'IBM Plex Sans')
        .style("background-color", 'white')
        .style("border", "2px solid " + fillColor)
        .style("box-shadow", '0px 0 2px 0.5px ' + fillColor)
        .style('text-align', 'start')

        const tooltipWidth = tooltip.node().getBoundingClientRect().width;
        tooltip.style('left', `${event.pageX - tooltipWidth - 10}px`);

    })
    .on('mouseout', function () {
      d3.select(this)
        .style('opacity', 1)
        .attr('stroke', 'none');
      // Hide the tooltip
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    })

    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y);

    svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);
    svg.append('g').call(yAxis);

    // cleanup funtion
    return () => {
      svg.selectAll("*").remove();
    }

  }, [data, containerWidth]);

  return (
    <div ref={containerRef} className='stackedBarChart'>
        <div className='topArea'>
          <div className='interactive'>
            <div className='title'>Engagements Graph</div>
            <div className="question-mark-container">
                <div
                  className="question-mark"
                  onMouseOver={handleMouseEnter}
                  onMouseOut={handleMouseLeave}
                >
                  ?
                </div>
                    {showTooltip ? <div className="graphInfoTooltip">
                    In a Stacked Bar Chart, each bar represents a day and is divided into colored sections for different metrics like saves, clicks, and reactions. This helps you quickly compare how each type of engagement contributes to the total daily activity on your Pin.
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
        <svg ref={chartRef} />
    </div>
  )
};

export default StackedBarChart;
