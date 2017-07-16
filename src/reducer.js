import { combineReducers } from 'redux';
import fromPairs from 'lodash.frompairs';
import takeRight from 'lodash.takeright';

/**
 * Data Format
 * { 
 *  prices: 
 *      {
        'BTC-USD': 
            {
                id: 'BTC-USD',
                display_name: 'BTC/USD',
                values: [{time: Time, price: 2345}, {time: Time, 2344}, ..]
            },
        // ...
        }
    }
 * @param {*} state 
 * @param {*} action 
 */
const prices = (state = {}, action) => {
    switch(action.type){
        case 'SET_PRODUCTS':
            return Object.assign({}, state, fromPairs(
                action.products.map(({ id, base_currency, display_name}) => [
                    id, 
                    {
                        id,
                        display_name,
                        base_currency,
                        values: []
                    }
                ])
            ));
        case 'ADD_VALUE':
            const {product, value} = action;
            let values = state[product].values.concat(value);
            if (values.length > 500){
                values = takeRight(values, 500);
            }
            return Object.assign({}, state, {
                [product]: Object.assign({}, state[product], {
                    values: values
                })
            });
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    prices
});

export default rootReducer;