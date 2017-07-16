import fromPairs from 'lodash.frompairs';
import groupBy from 'lodash.groupby';
import last from 'lodash.last';
import * as d3 from 'd3';
/**
 * take our data, 
 * chunk it into 3-second pieces, 
 * size each chunk, 
 * and return a list of product-volume objects like this:
 * [
    {time: 12345, 'BTC-USD': 3, 'ETH-USD': 2, 'LTC-USD': 10},
    {time: 12348, 'BTC-USD': 1, 'ETH-USD': 5, 'LTC-USD': 0},
    // ...
    ]   d3.stack knows how to take data of that shape and turn it into a streamgraph
    Here’s how we convert data from our state to something d3.stack can read:
        The conversion happens in 3 steps:
        Go through products and their values, and use lodash groupBy to turn them into groups based on timestamp
        Use d3.extent to find the oldest and latest timestamp in the data. Timestamps are group names from step 1.
        Create an iterator from t0 to t1 with a 3 second step, build array of objects
 * @param {*} prices 
 */
function chartValues (prices){

    const products = Object.values(prices),
          keys = Object.keys(prices);

     if (!products.length) {
        return [];
    }

    const chunked = fromPairs(products.map(({ id, values }) =>
        [id,
         groupBy(values, val => {
             // round to 3 second accuracy
             const t = val.time.getTime();
             return Math.round(t/3000)*3000;
         })
        ]
    ));

    let [t0, t1] = d3.extent(
        Object.values(chunked)
              .reduce((arr, p) => arr.concat(Object.keys(p)), [])
              .map(t => new Date(Number(t)))
    );

    return d3.timeSeconds(t0, t1, 3)
             .map(t => fromPairs(
                 Object.keys(chunked)
                       .map(k => [k, (chunked[k][t.getTime()] || []).length])
                       .concat([['time', t]])
            ))

}

/**
 * take prices or empty object, {}
 * deconstruct values out of it, use [] by default
 * take the last() value, or {price: 0} by default
 * @param {*} prices 
 */
function lastValueOrZero(prices) {
    return last(({ values = [] } = prices || {}).values) || {price: 0};
}

export { chartValues };