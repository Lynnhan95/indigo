import React from 'react'
import Chart from 'react-apexcharts'

class BarChart extends React.Component {

    constructor(props) {

      super(props);
      //Chart configuration
      this.state = {
        options: {
          plotOptions: {
            bar: {
                colors: {
                    ranges: [{
                      from: 0,
                      to: 10000,
                      color: '#2BA1FC'
                    }, {
                      from: 10000,
                      to: 20000,
                      color: '#FEBB43'
                    },
                    {
                        from: 20000,
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
              offsetY: -18
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
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                }
              }
            },
            tooltip: {
              style: {
                  color: "#333"
              },
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
            text: 'Total Harvest Acres Per County',
            floating: true,
            offsetY: 320,
            align: 'center',
            style: {
              color: '#444'
            }
          }
        },
        series: [{
          name: 'Total Harvest Acres',
          data: []
        }],
      }
    }

    //Once any of the two filters are changed, pass in the filtered data for components data
    componentDidUpdate(prevProps){
        if(prevProps.countyData !== this.props.countyData){
            const countyData = this.props.countyData["countyData"]
            // console.log(countyData)
            var countyArr = []
            var countyVal = []
            for(let i=0; i< countyData.length; i++){
                countyArr.push(countyData[i]["COUNTY_NAME"])
                countyVal.push(countyData[i]["TOTAL_HARVESTED_ACRES"])
            }
            //Update Series(Value)
            this.setState({
                series: [{
                    name: countyData[0]["STATE_CODE"],
                    data: countyVal.sort(function(a, b){return a-b})
                }]
            })
            //Update X-axis label(Category)
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

  export default BarChart