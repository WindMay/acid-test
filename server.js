const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const rx = require('rxjs');

const axios = require('axios'); // declare axios for making http requests
const cronBTC = rx.Observable.timer(1, 10000); //Updater BTC
const cronETH = rx.Observable.timer(1, 8000000); //Updater ETH
const API = 'https://www.alphavantage.co/query?';

const API_KEY = 'C3DOJ8C4CTA9Z14Q';
const router = require('./server/router')

// Once connected update currency data
const subscriberBTC = cronBTC.subscribe( () => {
  axios.get(`${API}function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${API_KEY}`).then(data_BTC => {
      console.log('BTC', data_BTC.data);
  }).catch(error => {
      console.log('Something went wrong updating the BTC daily data', error);
  });
  axios.get(`${API}function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=USD&apikey=${API_KEY}`).then(data_BTC => {
      console.log('BTC', data_BTC.data['Meta Data']);
  }).catch(error => {
      console.log('Something went wrong updating the BTC monthly data', error);
  });
});

const subscriberETH = cronETH.subscribe( () => {
  axios.get(`${API}function=DIGITAL_CURRENCY_DAILY&symbol=ETH&market=USD&apikey=${API_KEY}`).then(data_ETH => {
      console.log('ETH', data_ETH.data['Meta Data']);
  }).catch(error => {
      console.log('Something went wrong updating the ETH daily data', error);
  });
  axios.get(`${API}function=DIGITAL_CURRENCY_MONTHLY&symbol=ETH&market=USD&apikey=${API_KEY}`).then(data_ETH => {
      console.log('ETH', data_ETH.data['Meta Data']);
  }).catch(error => {
      console.log('Something went wrong updating the ETH monthly data', error);
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