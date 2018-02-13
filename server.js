const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const rx = require('rxjs');

const axios = require('axios'); // declare axios for making http requests
const cronJob = rx.Observable.timer(1, 5000); //Updater
const API = 'https://hn.algolia.com/api/v1';
const API_KEY = 'C3DOJ8C4CTA9Z14Q';
const router = require('./server/router')

// Once connected update articles
const subscriber = cronJob.subscribe(value => {
  console.log('Updating Articles...');
  // Get latest nodejs related articles
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