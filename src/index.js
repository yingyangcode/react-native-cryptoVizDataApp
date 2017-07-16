import React, { Component } from 'react';
import { Screen, Divider } from '@shoutem/ui';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider, connect } from 'react-redux';

import rootReducer from './reducer';
import { initData } from './actions';

import CurrentValue from './CurrentValue';
import TransactionVolumeGraph from './TransactionVolumeGraph';
import Description from './Description';




class App extends Component {
    /*
     store = createStore( rootReducer, applyMiddleware(
            thunkMiddleware,
            createLogger()
        )
    );
    */
    componentDidMount() {
        const { dispatch } = this.context;

        this.props.initData();
    }

    render() {
        return (
            
                <Screen>
                    <Divider />
                    <CurrentValue />
                    <Divider />
                    <Divider />
                    <TransactionVolumeGraph />
                    <Divider />
                    <Description />
                </Screen>
           
        );
    }
}
/*
const mapDispatchToProps = (dispatch) => {
  return {
    initData: () => {
      dispatch(initData())
    }
  }
}
*/
//const ConnectedApp = connect(state => state)(App);
/*const result = () => {
    <Provider store={store}>
        <ConnectedApp />
    </Provider>
};
*/
export default connect(state => state, {initData})(App);