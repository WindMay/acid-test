const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const rx = require('rxjs');

const axios = require('axios'); // declare axios for making http requests
const cronBTC = rx.Observable.timer(1, 10000); //Updater BTC
const cronETH = rx.Observable.timer(1, 80000); //Updater ETH
const API = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=';
const API_KEY = 'C3DOJ8C4CTA9Z14Q';
const router = require('./server/router')

// Once connected update articles
const subscriber = cronBTC.subscribe(value => {
  axios.get(`${API}&apikey=${API_KEY}`).then(data => {
      const data = articles.data;
      console.log(data)
  }).catch(error => {
      console.log('Something went wrong updating the data', error);
  });
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';

/**
 * Create HTTP server.
 */
const server = http.createServer(router.handleRequest);

/**
 * Listen on provided port.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));