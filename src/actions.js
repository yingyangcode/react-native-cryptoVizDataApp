import fetch from 'better-fetch';

const URL = "https://api-public.sandbox.gdax.com/",
      SOCKET_URL = "wss://ws-feed.gdax.com"

/**
 * We start by fetching a list of products from https://api-public.sandbox.gdax.com/products.
 * When we get our list, 
 * we dispatch two actions: A setter action setProducts 
 * and a rich thunk connectSocket that initiates the websocket firehose.
 */
export const initData = () => {
    return (dispatch) => {
        console.log('InitDataAction');
        fetch (`${URL}products`)
        .then(fetch.throwErrors)
        .then(res => res.json())
        .then(json => {
            dispatch(setProducts(json));
            dispatch(connectSocket());
        })
        .catch(e => console.error(e.message));
    };
}
/**
 * Websocket is a magic global object provided by React Native. 
 * It lets us connect to websockets just like you would on the web.
 * A socket opens a persistent connection between our app and a server. 
 * In this case, we connect to the GDAX exchange.
 * When our socket connects, it calls the onopen callback. 
 * We tell GDAX we’d like to receive messages about certain products by sending a 
 * type: 'subscribe' message and a list of product ids.
 * GDAX then starts sending us messages in real-time.
 * Each time we get one, our onmessage callback is triggered. 
 * In it, we parse the message, extract relevant data, and dispatch the addValue setter action.

 */
export const connectSocket = () => {
    const ws = new WebSocket(SOCKET_URL);
    console.log('connectSocket Action');
    return function (dispatch, getState) {
        ws.onopen = () => {
            const state = getState(),
                product_ids = Object.keys(state.prices)
                                    .map(k => state.prices[k].id);

            ws.send(JSON.stringify({
                type: 'subscribe',
                product_ids
            }));
        }

        ws.onmessage =(msg) => {
            const { type, price, product_id, reason, size } = JSON.parse(msg.data);
            const value = {
                time: new Date(),
                price: Number(price)
            }

            if(type === 'match' && price){
                dispatch(addValue(product_id, value));
            }

        }

        ws.onerror = (e) => {
            console.log(e.message);
        }

        ws.onclose = (e) => {
            console.log(e.code, e.reason);
        }
    }
}

export const setProducts = (products) => ({
    type: 'SET_PRODUCTS',
    products: products.filter(({quote_currency}) => quote_currency === 'USD')
});

export const addValue = (product, value) => ({
    type: 'ADD_VALUE',
    product,
    value
});