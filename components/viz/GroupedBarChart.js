import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';

const GroupedBarChart = ({ data, setVideoData }) => {
  
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

    const chartRef = useRef();

    const [targetMetrics, setTargetMetrics] = useState(null);

    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
      setShowTooltip(true);
    };
  
    const handleMouseLeave = () => {
      setShowTooltip(false);
    };

    function handleSelectedMetrics(selectedOptions) {
        setTargetMetrics(selectedOptions)
    }

    const colorScheme = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

    const options = [
        { value: '# of people who viewed 95% of the video', label: '# of People Who Viewed 95% of The Video' },
        { value: '# of video starts', label: '# of video starts' },
        { value: '# of people who viewed at least 10% of the video', label: '# of People Who Viewed At Least 10% of The Video' },
        { value: 'Total play time (in minutes)', label: 'Total Play Time (in minutes)' }
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
      setVideoData(targetMetrics)
    }, [targetMetrics])

    useEffect(() => {

      const aspectRatioWidth = 2;
      const aspectRatioHeight = 1;

      // (containerWidth / aspectRatioWidth) * aspectRatioHeight
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = (containerWidth - 30) - margin.left - margin.right;
      const height = ((containerWidth / aspectRatioWidth) * aspectRatioHeight) - margin.top - margin.bottom;

      const svg = d3
        .select(chartRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const categories = data.map((d) => d.day);
      const subCategories = data[0].metrics.map((m) => m.name);

      const tooltip = d3.select(chartRef.current.parentNode)
        .append('div')
        .style('width', 'fit-content')
        .style('height', 'fit-content')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', '#8383a4')
        .style('color', 'white')
        .style('padding', '5px')
        .style('border-radius', '3px');

      const x0 = d3.scaleBand().domain(categories).range([0, width]).padding(0.3);
      const x1 = d3.scaleBand().domain(subCategories).range([0, x0.bandwidth() ]).padding(0.01);
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d3.max(d.metrics, m => m.value))]).range([height, 0]);

      const color = d3.scaleOrdinal().domain(subCategories).range(colorScheme);

      const xAxis = d3.axisBottom(x0)

      svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
          .attr("transform", d => `translate(${x0(d.day)}, 0)`)
        .selectAll("rect")
        .data(d => d.metrics)
        .join("rect")
          .attr("x", d => x1(d.name))
          .attr("y", d => y(d.value))
          .attr("width", x1.bandwidth())
          .attr("height", d => height - y(d.value))
          .attr("fill", d => color(d.name))
          .on("mouseover", function (event, d) {
            d3.select(this)
              .style('opacity', 0.8);
            // Show tooltip on mouseover
            const fillColor = d3.select(this).style('fill');
            tooltip.style('visibility', 'visible')
              .html(`${d.name} <br> Value: <b>${d.value}</b><br>Date: ${this.parentNode.__data__.day}`)
              .style('top', `${event.pageY - 10}px`)
              .style('font-family', 'Arial, Helvetica, sans-serif')
              .style('font-size', '1.1em')
              .style("border", "2px solid " + fillColor)
              .style("font-family", 'IBM Plex Sans')
              .style('background', 'white')
              .style("color", '#1c1c57')
              .style('box-shadow', '0px 0 2px 0.5px ' + fillColor)
              .style('padding', '6px')


              const tooltipWidth = tooltip.node().getBoundingClientRect().width;
              tooltip.style('left', `${event.pageX - tooltipWidth - 10}px`);
          })
          .on("mouseout", function () {
            // Hide tooltip on mouseout
            d3.select(this)
              .style('opacity', 1)
            tooltip.style('visibility', 'hidden');
            svg.selectAll(".halo").remove();
          });

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

      svg.append("g")
        .call(d3.axisLeft(y));

      // cleanup function
      return () => {
        svg.selectAll("*").remove();
      }  

    }, [data, containerWidth]);

    return (
      <div ref={containerRef} className='groupedBarChart'>
          <div className='topArea'>
            <div className='interactive'>
              <div className='title'>Video Statistics</div>
              <div className="question-mark-container">
                  <div
                    className="question-mark"
                    onMouseOver={handleMouseEnter}
                    onMouseOut={handleMouseLeave}
                  >
                    ?
                  </div>
                      {showTooltip ? <div className="graphInfoTooltip">
                      This Grouped Bar Chart displays specific engagement metrics for your video Pin, including <em>video starts</em> and <em>total play time</em>, allowing you to directly assess viewer interaction.
                  </div> : ''}
              </div>
            </div> 
            <Select
                value={targetMetrics}
                onChange={handleSelectedMetrics}
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

export default GroupedBarChart;
