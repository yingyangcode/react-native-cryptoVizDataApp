import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Divider, Subtitle } from '@shoutem/ui';
import * as d3 from 'd3';

import { chartValues } from './helpers';
/**
 * we get a list of all times in our data and use it to extract the start time. 
 * We show that as “Volume since X” so users don’t feel lost in time too much.
 * We use chartValues again to calculate volumes for our dataset and turn it into a flat list of volumes with a .map. 
 * Yes, calling chartValues again in this component is inefficient
 * In the render output, we use d3.mean, d3.min, and d3.max to get appropriate values from our list of volumes. 
 * A d3.format helps us format the timestamp.
 */
const Description = connect(state => ({
    times: Object.values(state.prices)
                 .reduce((arr, { values }) => arr.concat(values), [])
                 .map(({ time }) => time),
    prices: state.prices
}))(({ times, prices }) => {
    const [start, end] = d3.extent(times);

    if (!start) {
        return (
            <View styleName="horizontal h-center">
                <Text>Waiting for data</Text>
            </View>
        );
    }

    const counts = chartValues(prices).map(value => {
        const keys = Object.keys(value).filter(k => k !== 'time');
        return keys.reduce((sum, k) => sum+value[k], 0);
    });

    const format = d3.timeFormat('%I:%M:%S');


    return (
        <View styleName="vertical h-center">
            <Text>Transaction volume since</Text>
            <Subtitle>{format(start)}</Subtitle>
            <Divider />
            <Text>Average <Subtitle>{(d3.mean(counts) || 0).toFixed(1)}</Subtitle> every 3 seconds</Text>
            <View styleName="horizontal h-center space-between">
                <Text style={{paddingLeft: 5, paddingRight: 5}}>
                    Min: <Subtitle>{d3.min(counts)}</Subtitle>
                </Text>
                <Text style={{paddingLeft: 5, paddingRight: 5}}>
                    Max: <Subtitle>{d3.max(counts)}</Subtitle>
                </Text>
            </View>
        </View>
    );
});

export default Description;