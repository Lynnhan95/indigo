import React, { Component } from 'react'
import { Select, Slider, Row, Col} from 'antd'
import "antd/dist/antd.css";
import './App.css'
import { csv } from 'd3'
import Map from './Map'
import BarChart from './barChart.js'
import BarChart2 from './barChart2.js'
import { max } from 'd3-array'

class App extends Component {
  constructor(props){
    super(props)
    this.state = 
    { screenWidth: 1000, screenHeight: 500, hover: "none", color: '#F6D51F', dropDownValue: "CORN", yearSliderValue: 2018, rawData:[], filteredData:[] }

  }

  onResize= () => {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120 })
  }

  onHover = (e) => {
    // console.log(e)
    this.setState({ hover: e.state })
    this.setState({ countyData: e})
    this.setState({ averageAcre: e.acreage })
  }

  dropDownChange = (value) => {
    this.setState({dropDownValue : value})
  }

  yearSliderChange = (value) => {
    this.setState({yearSliderValue : value})
  }

  getCropMax = (Arr) => {
    const CORPArray = []
    for(let i=0; i<Arr.length; i++){
      if(Arr[i]["COUNTY_NAME"] !== "OTHER (COMBINED) COUNTIES"){
        CORPArray.push(Arr[i]["TOTAL_HARVESTED_ACRES"])
      } 
    }
    return max(CORPArray)
  }

  getAverage = (num) => {
    if(num){
      const newNum = Math.round(num*100)/100
      return `: ${newNum} Acres`
    }

  }
  
  componentWillMount(){
    csv('/usda_crops_5yr.csv').then(data => {
      data.forEach(function(d) {
        d["FIPS_CODE"] = +d["FIPS_CODE"];
        d["YEAR"] = +d["YEAR"];
        d["TOTAL_HARVESTED_ACRES"] = +d["TOTAL_HARVESTED_ACRES"];
        d["TOTAL_YIELD"] = +d["TOTAL_YIELD"];
      })
      return data
    }).then(data => {
      //Initialize rawData and set default filteredData according to default dropDownValue and yearSliderValue
      const filteredData = data.filter((d) => {
        return (d.CORP == this.state.dropDownValue && d.YEAR == this.state.yearSliderValue)
      })
      const filteredData2 = data.filter((d) => {
        return (d.CORP == this.state.dropDownValue)
      }) 
      const cropMax = this.getCropMax(filteredData2)
      console.log(cropMax)
      this.setState({rawData: data})
      this.setState({filteredData: filteredData})
      this.setState({cropMax: cropMax})

    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate(prevProps, prevState){
    //If drop down value is changed
    const rawData = this.state.rawData
    if(this.state.dropDownValue !== prevState.dropDownValue ){
      //filter data according to time slider and drop down
        const filteredData = rawData.filter((d) => {
          return (d.CORP == this.state.dropDownValue && d.YEAR == this.state.yearSliderValue)
        })
      this.setState({filteredData: filteredData})
      
      //get Max value for each crop(all year), then passes as props to define the domain of rectangular radius
      const filteredData2 = rawData.filter((d) => {
        return (d.CORP == this.state.dropDownValue)
      })
      const cropMax = this.getCropMax(filteredData2)
      this.setState({cropMax: cropMax})

      //change colorTheme
      var color
      switch(this.state.dropDownValue){
        case "CORN":
          color = "#F6D51F"
          break;
        case "COTTON":
          color = "#AFDEE3"
          break;
        case "RICE":
          color = "#FA7E48"
          break;
        case "SOYBEANS":
          color = "#A8BD64"
          break;
        case "WHEAT":
          color = "#B3A396"
          break;
        default:
          //do nothing
      }
      this.setState({color: color})
    }
    //If time slider is changed
    if(this.state.yearSliderValue !== prevState.yearSliderValue){
      //filter data according to time slider and drop down
      const filteredData = rawData.filter((d) => {
        return (d.CORP == this.state.dropDownValue && d.YEAR == this.state.yearSliderValue)
      })
      this.setState({filteredData: filteredData})
    }

  }
  

  render() {
    const DropDown = (
      <Select defaultValue="CORN" onChange={this.dropDownChange} className="dropDown" style={{ width: 120 }} >
        <Option value="CORN">CORN</Option>
        <Option value="RICE">RICE</Option>
        <Option value="SOYBEANS">SOYBEANS</Option>
        <Option value="COTTON">COTTON</Option>
        <Option value="WHEAT">WHEAT</Option>
      </Select>
    )

    const marks = {
      2014: '2014',
      2015: '2015',
      2016: '2016',
      2017: '2017',
      2018: '2018'
    };

    const YearSlider = (
      <Slider min={2014} max={2018} vertical onChange={this.yearSliderChange} marks={marks} included={false} defaultValue={2018} />
    )

    
    return (
      <div className="App">
        <div className="App-header">
          {/* {console.log(this.state.filteredData)} */}
          {console.log(this.state.hover)}
          <h2>Indigo Seed Dashboard for { DropDown }</h2>
        </div>
        <div className="dashboardWrapper">
          <div className="dashboardSec1">
            <Row>
            <Col span={4}>
            <div className="yearSlider">
            <h2>Year: {this.state.yearSliderValue}</h2>
            { YearSlider }
            </div>
            </Col>
            <Col span={20}>
            <h2>Acreage Distribution Map - {this.state.dropDownValue}</h2>
            <h3>The state you are viewing: {this.state.hover}</h3>
            <Map colorTheme = {this.state.color} filteredData = {this.state.filteredData} maxData = {this.state.cropMax} hoverElement={this.state.hover} onHover={this.onHover} size={[ 2 * this.state.screenWidth /3 , this.state.screenHeight ]}></Map>
            </Col>
            </Row>
          </div>
          <h3 className="sec2title">Hover over a state in the map to see county data below</h3>
          <div className="dashboardSec2">
            <BarChart countyData = {this.state.countyData}/>
            <BarChart2 countyData = {this.state.countyData}/>
            </div>
          </div>
      </div>
    )
  }
}

export default App