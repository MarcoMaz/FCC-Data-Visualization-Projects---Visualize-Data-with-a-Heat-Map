let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

let baseTemp
let values = []

let xScale
let yScale

let xAxis
let yAxis

let width = 1200
let height = 600
let padding = 60

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let generateScales = () => {
  let minYear = d3.min(values, d => d['year'])
  let maxYear = d3.max(values, d => d['year'])

  xScale = d3.scaleLinear()
          .domain([minYear, maxYear + 1])
          .range([padding, width - padding])

  yScale = d3.scaleTime()
          .domain([new Date(0,0,0,0, 0, 0, 0), new Date(0,12,0,0,0,0,0)])
          .range([padding, height - padding])
}

let drawCanvas = () => {
  svg.attr('width', width)
  svg.attr('height', height)
}

let drawCells = () => {

  svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class','cell')
    .attr('fill', d => {
      let variance = d['variance']
      if ( variance <= -1 ) {
        return '#1F361D'
      } else if ( variance <= 0 ) {
        return '#141E12'
      } else if ( variance <= 1 ) {
        return '#729B6E'
      } else {
        return '#34E54A'
      }
    })
    .attr('data-year', d => d['year'])
    .attr('data-month', d => d['month'] - 1)
    .attr('data-temp', d => baseTemp + d['variance'])
    .attr('height', d =>  (height - (2 * padding)) / 12)
    .attr('y', d => yScale(new Date(0, d['month']-1, 0, 0, 0, 0, 0)))
    .attr('width', d => {
      let minYear = d3.min(values, d => d['year'])
      let maxYear = d3.max(values, d => d['year'])
      let yearCount = maxYear - minYear
      return (width - (2 * padding)) / yearCount
    })
    .attr('x', d => xScale(d['year']))
    .on('mouseover', d => {
      tooltip.transition().style('visibility', 'visible')
      .style('left', ( d3.event.pageX + 30 ) + 'px')
      .style('top', ( d3.event.pageY - 40 ) + 'px')

      let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  
      tooltip
      .text(d['year'] + ' ' + monthNames[d['month'] -1 ] + ' : ' + d['variance'])
      .attr('data-year', d['year'])
    })
    .on('mouseout', (item) => {
      tooltip.transition().style('visibility', 'hidden')
    })
        
}

let generateAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'))

  svg.append('g').call( xAxis )
    .attr('id','x-axis')
    .attr('transform', 'translate(0, ' + ( height - padding ) + ')')

  svg.append('g').call( yAxis )
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)') 
}

d3.json( url ).then( function ( data ){
  baseTemp = data.baseTemperature
  values = data.monthlyVariance
  drawCanvas()
  generateScales()
  drawCells()
  generateAxes()
})

