import React, { Component } from 'react';
import './App.scss';
import axios from 'axios';
import Chart from './Chart';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btc: null,
      eth: null
    }

  };

  loadData(currency, period) {
    axios.get(`http://localhost:3003/api/${currency}/${period}`).then(res => {
      const data = res.data;
      const formattedDate = [];
      for (let date in data) {
        formattedDate.push({
          absoluteChange: undefined,
          date: new Date(date),
          close: data[date]['4a. close (USD)'],
          high: data[date]['2a. high (USD)'],
          low: data[date]['3a. low (USD)'],
          open: data[date]['1a. open (USD)'],
          dividend: '',
          percentChange: undefined,
          split: "",
          volume: data[date]['5. volume']
        });
      }
      formattedDate.reverse();
      formattedDate['columns'] = ["date", "open", "high", "low", "close", "volume"];
      this.setState(prevState => {
        let nextState = prevState;
        nextState[currency] = formattedDate;
        return nextState;
      })
      console.log('state', this.state)
    }).catch(error => {
      console.log('Something went wrong updating the BTC daily data', error);
    });
  }

  componentDidMount() {
    // load initial data
    this.loadData('btc', 'daily');
    this.loadData('eth', 'daily');
  }

  render() {
    if (this.state.btc === null || this.state.eth === null) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="app">
          <header className="app-header">
            <h1 className="app-title">BTC and ETH Fluctuations</h1>
          </header>
          <div className="app-content">
            <div className="app-graph-container">
              <h1 className="graph-title">BTC</h1>
              <Chart type={'hybrid'} data={this.state.btc} width={600} pointsPerPxThreshold={4000} />
            </div>
            <div className="app-graph-container">
              <h1 className="graph-title">ETH</h1>
              <Chart type={'hybrid'} data={this.state.eth} width={600} />
            </div>
          </div>
        </div>
      );
    }

  }
}

export default App;
