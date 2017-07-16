import React, { Component } from 'react';
import { G, Path } from 'react-native-svg';
import * as d3 from 'd3';
/**
 * We create a d3.stack generator, 
 * tell it which keys to look for in each datapoint, 
 * to avoid any ordering, 
 * and to arrange our data in a silhouette. 
 * Then we use it to create a series.
 * This creates data perfectly suited to feed into an area generator. 
 * Each data point has coordinates with ys set up so values with the same x stack one on top of the other.
 * Then we create two linear scales, x and y, 
 * that will help us translate our data values to our drawing values. 
 * x maps timestamps in our dataset to horizontal UI coordinates. 
 * y maps values to vertical coordinates.
 * Using our x and y scales, we create an area generator 
 * and tell it how to use our scales via the y0, y1, and x value accessors. 
 * Now we can feed entries from our series into area to generate SVG shapes.
 * To render our Streamgraph, we use a <G> grouping element, 
 * and fill it with a stream of <Path>s. 
 * Each path’s d attribute, which defines its shape, comes from our area generator.
 * We use one of D3’s default color schemes to color our graph. 
 * schemeCategory20c with an offset of 8 gives us shades of green.
 * @param {*} param0 
 */
const StreamGraph = ({ keys, values, width, height }) => {
    const stack = d3.stack()
                    .keys(keys)
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetSilhouette),
          series = stack(values);

    if (!series.length) {
        return null;
    }

    const colors = d3.schemeCategory20c,
          y = d3.scaleLinear()
                .domain([
                    d3.min(series[0].map(([y0, y1]) => y0)),
                    d3.max(series[series.length-1].map(([y0, y1]) => y1))
                ])
                .range([0, height]),
          x = d3.scaleLinear()
                .domain(d3.extent(values.map(v => v.time)))
                .range([0, width]);

    const area = d3.area()
                   .y0(([y0, y1]) => y(y0))
                   .y1(([y0, y1]) => y(y1))
                   .x(({ data }) => x(data.time));

    return (
        <G>
            {series.map((s, i) => area(s)
                    ? <Path d={area(s)}
                            fill={colors[8+i]}
                            key={keys[i]} />
                    : null
            )}
        </G>
    );
};

export default StreamGraph;