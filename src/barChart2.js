import React from 'react'
import Chart from 'react-apexcharts'

class BarChart2 extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        options: {
          plotOptions: {
            bar: {
            colors: {
                ranges: [{
                    from: 0,
                    to: 100,
                    color: '#2BA1FC'
                }, {
                    from: 100,
                    to: 200,
                    color: '#FEBB43'
                },
                {
                    from: 200,
                    to:1000000,
                    color: '#F37565'
                    }
            ]
            },
              dataLabels: {
                position: 'top', // top, center, bottom
                style: {
                    fontSize: '7px'
                },
              },
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val
            },
            offsetY: -20,
            style: {
              fontSize: '8px',
              colors: ["#304758"]
            }
          },
          xaxis: {
            categories: [],
            position: 'top',
            labels: {
              offsetY: -18,
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                }
              }
            },
            tooltip: {
              enabled: true,
              offsetY: -35,
            }
          },
          fill: {
            gradient: {
              shade: 'light',
              type: "horizontal",
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [50, 0, 100, 100]
            },
          },
          yaxis: {
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              formatter: function (val) {
                return val ;
              }
            }
          },
          title: {
            text: 'Total Yield Per County',
            floating: true,
            offsetY: 320,
            align: 'center',
            style: {
              color: '#444'
            }
          }
        },
        series: [{
          name: 'Total Yield',
          data: []
        }],
      }
    }


    componentDidUpdate(prevProps){
        if(prevProps.countyData !== this.props.countyData){
            const countyData = this.props.countyData["countyData"]
            // console.log(countyData)
            var countyArr = []
            var countyVal = []
            for(let i=0; i< countyData.length; i++){
                countyArr.push(countyData[i]["COUNTY_NAME"])
                countyVal.push(countyData[i]["TOTAL_YIELD"])
            }
            this.setState({
                series: [{
                    name: countyData[0]["STATE_CODE"],
                    data: countyVal.sort(function(a, b){return a-b})
                }]
            })
            this.setState({
                options: {
                   ...this.state.options,
                  xaxis: {
                    ...this.state.options.xaxis,
                    categories: countyArr
                    }
                  }
            })
        }
    }

    render() {
      return (
        <div id="chart">
          <Chart options={this.state.options} series={this.state.series} type="bar" height="350" />
        </div>
      );
    }
  }

  export default BarChart2