import React, { Component } from "react"
import { geoPath, geoMercator } from "d3-geo"
import { scaleSqrt } from 'd3-scale'
import { feature } from "topojson-client"
import { Popover } from 'antd'

class WorldMap extends Component {
  constructor() {
    super()
    this.state = {
      usMap: [],
      usProperty: [],
      stateData: []
    }
  }
  //Set projection function that maps coordinates data to GeoJson
  projection() {
    return geoMercator()
          .scale(800)
          .center([-98.5795, 39.8283])
  }
  //Data post-processing 
  //Set StateObj for 48 states, that enables retrieving  state data with state key name, the data is presented as Array
  getStateObj(Arr){
    //Initialize StateObj
    const stateObj = {
      "AL":[], "AR":[], "AZ":[], "CA":[], "CO":[], "CT":[], "DE":[], "FL":[], "GA":[], "HI":[], "IA":[], "ID":[], "IL":[], "IN":[], "KS":[], "KY":[], "LA":[], "MA":[], "MD":[], "ME":[], "MI":[], "MN":[], "MO":[], "MS":[], "MT":[], "NC":[], "ND":[], "NE":[], "NJ":[], "NM":[], "NV":[], "NY":[], "OH":[], "OK":[], "OR":[], "PA":[], "RI":[], "SC":[], "SD":[], "TN":[], "TX":[] , "UT":[] , "VA":[] , "VT":[] , "WA":[], "WI":[], "WV":[], "WY":[]
    }
    //Shallow copy value
    for(let i=0; i< Arr.length; i++){
      switch (Arr[i]["STATE_CODE"]){
        case "AL":
          stateObj.AL.push(Arr[i])
          break;

        case "AR":
          stateObj.AR.push(Arr[i])
          break;

        case "AZ":
          stateObj.AZ.push(Arr[i])
          break;    
          
        case "CA":
          stateObj.CA.push(Arr[i])
          break;  

        case "CO":
          stateObj.CO.push(Arr[i])
          break;  

        case "CT":
          stateObj.CT.push(Arr[i])
          break; 

        case "DE":
          stateObj.DE.push(Arr[i])
          break; 

        case "FL":
          stateObj.FL.push(Arr[i])
          break; 

        case "GA":
          stateObj.GA.push(Arr[i])
          break; 

        case "HI":
          stateObj.HI.push(Arr[i])
          break; 

        case "IA":
            stateObj.IA.push(Arr[i])
            break; 

        case "ID":
            stateObj.ID.push(Arr[i])
            break; 

        case "IL":
            stateObj.IL.push(Arr[i])
            break; 

        case "IN":
            stateObj.IN.push(Arr[i])
            break; 

        case "KS":
            stateObj.KS.push(Arr[i])
            break; 

        case "KY":
            stateObj.KY.push(Arr[i])
            break; 

        case "LA":
            stateObj.LA.push(Arr[i])
            break;
            
        case "MA":
            stateObj.MA.push(Arr[i])
            break; 

        case "MD":
            stateObj.MD.push(Arr[i])
            break; 

        case "ME":
            stateObj.ME.push(Arr[i])
            break; 

        case "MI":
            stateObj.MI.push(Arr[i])
            break;
            
        case "MN":
            stateObj.MN.push(Arr[i])
            break; 

        case "MO":
            stateObj.MO.push(Arr[i])
            break; 

        case "MS":
            stateObj.MS.push(Arr[i])
            break; 

        case "MT":
            stateObj.MT.push(Arr[i])
            break; 

        case "NC":
            stateObj.NC.push(Arr[i])
            break; 

        case "ND":
            stateObj.ND.push(Arr[i])
            break; 

        case "NE":
            stateObj.NE.push(Arr[i])
            break; 

        case "NJ":
            stateObj.NJ.push(Arr[i])
            break; 

        case "NM":
            stateObj.NM.push(Arr[i])
            break; 

        case "NV":
            stateObj.NV.push(Arr[i])
            break; 

        case "NY":
            stateObj.NY.push(Arr[i])
            break; 

        case "OH":
            stateObj.OH.push(Arr[i])
            break; 

        case "OK":
            stateObj.OK.push(Arr[i])
            break; 

        case "OR":
            stateObj.OR.push(Arr[i])
            break; 

        case "PA":
            stateObj.PA.push(Arr[i])
            break; 

        case "RI":
            stateObj.RI.push(Arr[i])
            break; 

        case "SC":
            stateObj.SC.push(Arr[i])
            break; 

        case "SD":
            stateObj.SD.push(Arr[i])
            break; 

        case "TN":
            stateObj.TN.push(Arr[i])
            break; 

        case "TX":
            stateObj.TX.push(Arr[i])
            break; 

        case "UT":
            stateObj.UT.push(Arr[i])
            break; 

        case "VA":
            stateObj.VA.push(Arr[i])
            break; 

        case "VT":
            stateObj.VT.push(Arr[i])
            break; 

        case "WA":
            stateObj.WA.push(Arr[i])
            break; 

        case "WI":
            stateObj.WI.push(Arr[i])
            break;
            
        case "WV":
            stateObj.WV.push(Arr[i])
            break;

        case "WY":
            stateObj.WY.push(Arr[i])
            break;
  
        default:
          //do nothing
      }
    }
    return stateObj
  }

  //Helper function
  getAverage(Arr){
    var sum = null
    for(let i=0; i<Arr.length; i++){
       sum += Arr[i]["TOTAL_HARVESTED_ACRES"]
    }
    return (sum/(Arr.length))
  }

  //Fetch U.S topojson data
  componentDidMount() {
    fetch("/us-states.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(usMap => {
          this.setState({
            usMap: feature(usMap, usMap.objects.states).features,
          })

        })
      })
  }

  componentDidUpdate(prevProps){
    if(prevProps.filteredData !== this.props.filteredData){
      // console.log(this.props.filteredData)
      const filteredData = this.props.filteredData
      const stateObj = this.getStateObj(filteredData)
      console.log(stateObj)
      //Set stateData with some values that can not get from the original CSV file(such as coordinates), and calculate average acreage for each state.
      var stateData = [
        {state: 'AL', id: 0, coordinates: [-86.9023, 32.3182], acreage: null, countyData: stateObj.AL},
        {state: 'AR', id: 1, coordinates: [-91.8318, 35.2010], acreage: null, countyData: stateObj.AR},
        {state: 'AZ', id: 2, coordinates: [-111.0937, 34.0489], acreage: null, countyData: stateObj.AZ},
        {state: 'CA', id: 3, coordinates: [-119.4179, 36.7783], acreage: null, countyData: stateObj.CA},
        {state: 'CO', id: 4, coordinates: [-105.7821, 39.5501], acreage: null, countyData: stateObj.CO},
        {state: 'CT', id: 5, coordinates: [-73.0877, 41.6032], acreage: null, countyData: stateObj.CT},
        {state: 'DE', id: 6, coordinates: [-75.5277, 38.9108], acreage: null, countyData: stateObj.DE},
        {state: 'FL', id: 7, coordinates: [-81.5158, 27.6648], acreage: null, countyData: stateObj.FL},
        {state: 'GA', id: 8, coordinates: [-82.9001, 32.1656], acreage: null, countyData: stateObj.GA},
        {state: 'HI', id: 9, coordinates: [-155.5828, 19.8968], acreage: null, countyData: stateObj.HI},
        {state: 'IA', id: 10, coordinates: [-93.0977, 41.8780], acreage: null, countyData: stateObj.IA},
        {state: 'ID', id: 11, coordinates: [-114.7420, 44.0682], acreage: null, countyData: stateObj.ID},
        {state: 'IL', id: 12, coordinates: [-89.3985, 40.6331], acreage: null, countyData: stateObj.IL},
        {state: 'IN', id: 13, coordinates: [-86.1349, 40.2672], acreage: null, countyData: stateObj.IN},
        {state: 'KS', id: 14, coordinates: [-98.4842, 39.0119], acreage: null, countyData: stateObj.KS},
        {state: 'KY', id: 15, coordinates: [-84.2700, 37.8393], acreage: null, countyData: stateObj.KY},
        {state: 'LA', id: 16, coordinates: [-91.9623, 30.9843], acreage: null, countyData: stateObj.LA},
        {state: 'MA', id: 17, coordinates: [-71.3824, 42.4072], acreage: null, countyData: stateObj.MA},
        {state: 'MD', id: 18, coordinates: [-76.6413, 39.0458], acreage: null, countyData: stateObj.MD},
        {state: 'ME', id: 19, coordinates: [-69.4455, 45.2538], acreage: null, countyData: stateObj.MD},
        {state: 'MI', id: 20, coordinates: [-85.6024, 44.3148], acreage: null, countyData: stateObj.MI},
        {state: 'MN', id: 21, coordinates: [-94.6859, 46.7296], acreage: null, countyData: stateObj.MN},
        {state: 'MO', id: 22, coordinates: [-91.8318, 37.9643], acreage: null, countyData: stateObj.MO},
        {state: 'MS', id: 23, coordinates: [-89.3985, 32.3547], acreage: null, countyData: stateObj.MS},
        {state: 'MT', id: 24, coordinates: [-110.3626, 46.8797], acreage: null, countyData: stateObj.MT},
        {state: 'NC', id: 25, coordinates: [-79.0193, 35.7596], acreage: null, countyData: stateObj.NC},
        {state: 'ND', id: 26, coordinates: [-101.0020, 47.5515], acreage: null, countyData: stateObj.ND},
        {state: 'NE', id: 27, coordinates: [-99.9018, 41.4925], acreage: null, countyData: stateObj.NE},
        {state: 'NJ', id: 28, coordinates: [-74.4057, 40.0583], acreage: null, countyData: stateObj.NJ},
        {state: 'NM', id: 29, coordinates: [-105.8701, 34.5199], acreage: null, countyData: stateObj.NM},
        {state: 'NV', id: 30, coordinates: [-116.4194, 38.8026], acreage: null, countyData: stateObj.NV},
        {state: 'NY', id: 31, coordinates: [-74.2179, 43.2994], acreage: null, countyData: stateObj.NY},
        {state: 'OH', id: 32, coordinates: [-82.9071, 40.4173], acreage: null, countyData: stateObj.OH},
        {state: 'OK', id: 33, coordinates: [-97.0929, 35.0078], acreage: null, countyData: stateObj.OK},
        {state: 'OR', id: 34, coordinates: [-120.5542, 43.8041], acreage: null, countyData: stateObj.OR},
        {state: 'PA', id: 35, coordinates: [-77.1945, 41.2033], acreage: null, countyData: stateObj.PA},
        {state: 'RI', id: 36, coordinates: [-71.4774, 41.5801], acreage: null, countyData: stateObj.RI},
        {state: 'SC', id: 37, coordinates: [-81.1637, 33.8361], acreage: null, countyData: stateObj.SC},
        {state: 'SD', id: 38, coordinates: [-99.9018, 43.9695], acreage: null, countyData: stateObj.SD},
        {state: 'TN', id: 39, coordinates: [-86.5804, 35.5175], acreage: null, countyData: stateObj.TN},
        {state: 'TX', id: 40, coordinates: [-99.9018, 31.9686], acreage: null, countyData: stateObj.TX},
        {state: 'UT', id: 41, coordinates: [-111.0937, 39.3210], acreage: null, countyData: stateObj.UT},
        {state: 'VA', id: 42, coordinates: [-78.6569, 37.4316], acreage: null, countyData: stateObj.VA},
        {state: 'VT', id: 43, coordinates: [-72.5778, 44.5588], acreage: null, countyData: stateObj.VT},
        {state: 'WA', id: 44, coordinates: [-120.7401, 47.7511], acreage: null, countyData: stateObj.WA},
        {state: 'WI', id: 45, coordinates: [-88.7879, 43.7844], acreage: null, countyData: stateObj.WI},
        {state: 'WV', id: 46, coordinates: [-80.4549, 38.5976], acreage: null, countyData: stateObj.WV},
        {state: 'WY', id: 47, coordinates: [-107.2903, 43.0760], acreage: null, countyData: stateObj.WY},
      ]
      //Use a temporal array to collect state-level data
      var acreageArr = []
      for(var property in stateObj){
        if(stateObj.hasOwnProperty(property)){
          switch (property){
            case "AL":
              stateData[0].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "AR":
              stateData[1].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "AZ":
              stateData[2].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "CA":
              stateData[3].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "CO":
              stateData[4].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "CT":
              stateData[5].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "DE":
              stateData[6].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "FL":
              stateData[7].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "GA":
              stateData[8].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "HI":
              stateData[9].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "IA":
              stateData[10].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "ID":
              stateData[11].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "IL":
              stateData[12].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "IN":
              stateData[13].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;

            case "KS":
              stateData[14].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "KY":
              stateData[15].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "LA":
              stateData[16].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "MA":
              stateData[17].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "MD":
              stateData[18].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "ME":
              stateData[19].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "MI":
              stateData[20].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "MN":
              stateData[21].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "MO":
              stateData[22].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "MS":
              stateData[23].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "MT":
              stateData[24].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "NC":
              stateData[25].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "ND":
              stateData[26].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "NE":
              stateData[27].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "NJ":
              stateData[28].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "NM":
              stateData[29].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "NV":
              stateData[30].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "NY":
              stateData[31].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "OH":
              stateData[32].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "OK":
              stateData[33].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "OR":
              stateData[34].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "PA":
              stateData[35].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "RI":
              stateData[36].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "SC":
              stateData[37].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "SD":
              stateData[38].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "TN":
              stateData[39].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "TX":
              stateData[40].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "UT":
              stateData[41].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "VA":
              stateData[42].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "VT":
              stateData[43].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "WA":
              stateData[44].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "WI":
              stateData[45].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "WV":
              stateData[46].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
            case "WY":
              stateData[47].acreage = this.getAverage(stateObj[property])
              acreageArr.push(this.getAverage(stateObj[property]))
              break;
          }
        }
      }
      console.log(stateData)
      this.setState({stateData : stateData})

    }
  }

  //render U.S state-level map
  /* style={{cursor: "pointer", fill: this.props.hoverElement === d.id ? "yellow" : "red", stroke: "#fff", strokeOpacity: 0.5 }} */
  //Render GeoJson path, and mapping Rect, of which size depends on data value
  render() {
    const radius = scaleSqrt().domain([0, this.props.maxData]).range([0,80])
    const state =  this.state.usMap.map((d,i) => (
      <path
        key={ `path-${ i }` }
        d={ geoPath().projection(this.projection())(d) }
        className="states"
        stroke="#fff"
        fill="#E7E7E7"
        strokeWidth={ 1.4 }
      />
    ))
    const rect =  this.state.stateData.map((d,i) => 
    {
      if(radius(d.acreage)){
        const content = (
        <div><span>Average Harvested Acres:</span><br/><span><b>{Math.round(d.acreage)} </b>(acre)</span></div>
        )
        return (
          <Popover content={content} title={d.state} key={ `popover-${ i }` }>
          <rect
            key={ `rects-${ i }` }
            width={ radius(d.acreage) }
            height={ radius(d.acreage) }
            className="rects"
            stroke="#fff"
            fill={ this.props.colorTheme }
            x={ this.projection()(d.coordinates)[0] - radius(d.acreage)/2 }
            y={ this.projection()(d.coordinates)[1] - radius(d.acreage)/2 }
            strokeWidth={ 0.5 }
            opacity={ 0.8 }
            onMouseEnter={ () => {this.props.onHover(d)}}
            style={{cursor: "pointer"}}
          />
          </Popover>
        )
      }

    })
    return (
      //draw entire dashboard section one
      <svg width={this.props.size[0]} height={ 520 }  viewBox={ `0 0 ${ this.props.size[0] } ${ 520 }` }>
        {/* {console.log(this.state.stateData)} */}
        <g className="state">
          {state}
        </g>
        <g className="rect">
          {rect}
        </g>
      </svg>
    )
  }
}

export default WorldMap