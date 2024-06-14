import React from 'react';
import Chart from 'react-apexcharts';

const MacdIndicator = ({ macdData }) => {

  const parseDate = (dateString) => {
    return new Date(dateString).getTime();
  };

  const setBarColors = (histogramData) => {
    return histogramData.map(value => value < 0 ? '#ff0000' : '#008000');
  };

  const options = {
    colors:['#ffc000', '#674ea7'],
    chart:{
      // id:'macd',
      // group: "first",
      type:'bar',
      height: 350,
      events: {
        mounted: function(chartContext, config) {
          chartContext.config.tooltip.followCursor = true;
        }
      }
    },
    stroke: {
      width: [2, 2, 4]
    },
    xaxis: {
      type: 'category',
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
    },
    yaxis: [
      {
        seriesName: 'MACD s',
        show: false
      },
      {
        seriesName: 'MACD',
        show: false
      },
      {
        seriesName: 'MACD histogram',
        show: false
      }
    ],
    tooltip: {
      x: {
        format: 'HH:mm'
      }
    },
    legend: {
      position: 'top'
    }
  };

  const xData = macdData.map(item => (
    item.Date.split('T')[0] + " " + item.Date.split('T')[1].split('.')[0].slice(0, 5)
  ));

  const series = [
    {
      name: 'MACD slow',
      type: 'line',
      data: macdData.map(data => [parseDate(data.Date), data.MACDs_12_26_9]),
      x: xData
    },
    {
      name: 'MACD',
      type: 'line',
      data: macdData.map(data => [parseDate(data.Date), data.MACD_12_26_9]),
      x: xData
    },
    {
      name: 'MACD histogram',
      type: 'bar',
      data: macdData.map(data => [parseDate(data.Date), data.MACDh_12_26_9]),
      color: setBarColors(macdData.map(data => data.MACDh_12_26_9)),
      x: xData
    }
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">MACD indicator</h1>
      <Chart options={options} series={series} type="line" height="400" />
    </div>
  );
};

export default MacdIndicator;
