import React, { Component } from 'react';
import './App.scss';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btc: {},
      eth: {}
    }
  };

  loadData(currency, period) {
    axios.get(`http://localhost:3003/api/${currency}/${period}`).then(res => {
      const data = res.data;
      this.setState(prevState => {
        let nextState = prevState;
        nextState[currency] = data;
        return nextState;
      })
      console.log('state', this.state)
    }).catch(error => {
      console.log('Something went wrong updating the BTC daily data', error);
    });
  }



  componentDidMount() {
    this.loadData('btc', 'daily');
    this.loadData('eth', 'daily');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">BTC and ETH Fluctuations</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
