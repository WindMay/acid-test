const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');


const router = require('./server/router')



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