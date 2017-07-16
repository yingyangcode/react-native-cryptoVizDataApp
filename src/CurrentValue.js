import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Subtitle, Heading, Text } from '@shoutem/ui';
import last from 'lodash.last';

//import { lastValueOrZero } from './helpers';
/**
 * In theory, the current value of any cryptocoin is the price of the last successful transaction. 
 * That means we have to look at our Redux store and fetch the last known value for each coin.
 * We use the map-state-to-props function in our Redux connect() call to do the heavy lifting. 
 * It builds a sum of last known values, and a list of last known values for each coin.
 */
function lastValueOrZero(prices) {
    return last(({ values = [] } = prices || {}).values) || {price: 0};
}

const CurrentValue = connect(state => ({
    sum: Object.values(state.prices)
               .map(({ values }) => last(values) || {price: 0})
               .reduce((sum, { price }) => sum+price, 0),
    btc: lastValueOrZero(state.prices['BTC-USD']),
    eth: lastValueOrZero(state.prices['ETH-USD']),
    ltc: lastValueOrZero(state.prices['LTC-USD'])
}))(({ sum, btc, eth, ltc }) => (
    <View>
        <Subtitle styleName="h-center">Current Crypto Value</Subtitle>
        <Heading styleName="h-center" style={{paddingTop: 10}}>
            ${sum.toFixed(2)}
        </Heading>
        <View styleName="horizontal h-center space-between" style={{paddingLeft: 20,
                                                                   paddingRight: 20}}>
            <Text>BTC: ${btc.price.toFixed(2)}</Text>
            <Text>ETH: ${eth.price.toFixed(2)}</Text>
            <Text>LTC: ${ltc.price.toFixed(2)}</Text>
        </View>
    </View>
));

export default CurrentValue;