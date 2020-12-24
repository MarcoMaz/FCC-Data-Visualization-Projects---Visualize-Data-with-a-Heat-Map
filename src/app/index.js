import '../styles/main.scss'
import * as d3 from "d3";

var width = 800
var height = 400

var svgContainer =  d3.select('#root')
    .append('svg')
    .attr('width', width)
    .attr('height', height)