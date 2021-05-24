import React from 'react'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'

import './Piechart.module.css'

HighchartsMore(Highcharts)

const Piechart = (props) => {

    const chartOptions = {
        colors: props.colorsArray, //['#00ff00']
        chart: {
          type: 'column',
          backgroundColor:'transparent',
          inverted: true,
          polar: true
        },
        title: {
          text: 'saúde média',
          style:{
            color: props.colorsArray[0],
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: props.titleFontSize,
            letterSpacing: '5px',
            fontWeight: 800
          }
        },
        tooltip: {
          outside: true,
          enabled:false
        },
        pane: {
          size: '85%',
          innerSize: '20%',
          endAngle: 270
        },
        xAxis: {
          tickInterval: 1,
          gridLineColor: '#ccc',
          labels: {
            align: 'right',
            useHTML: true,
            allowOverlap: true,
            step: 1,
            y: 3,
            style: {
              fontSize: '25px',
              fontWeight: 800,
              color: props.colorsArray[0]
            }
          },
          lineWidth: 0,
          categories: [
              '',
              props.stringHealthscore
          ]
        },
        yAxis: {
          crosshair: {
            enabled: true,
            color: '#333'
          },
          lineWidth: 0,
          tickInterval: 5,
          gridLineColor: '#ccc',
          reversedStacks: false,
          endOnTick: true,
          showLastLabel: true
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.15
            
          }
        },
        legend: {
            enabled:false
        },
        series: [{
            name: props.legend,
            data: [100, props.data]
          }]
    }


    return (
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
    )
}

export default Piechart