const url = require('url');
const rx = require('rxjs');
// CRON tasks
const cronDaily = rx.Observable.timer(1, 3600000); //Updater BTC
const cronMonthly = rx.Observable.timer(1, 86400000); //Updater ETH
// API
const axios = require('axios'); // declare axios for making http requests
const API = 'https://www.alphavantage.co/query?';
const API_KEY = 'C3DOJ8C4CTA9Z14Q';
const redis = require("redis"), client = redis.createClient({port: 6379});

// Connect to the DB
client.on("error", function (err) {
  console.log("Error on redis connect" + err);
});

const dailyRequests = () => {
  axios.get(`${API}function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${API_KEY}`).then(data_BTC => {
    console.log('BTC daily data updated');
    client.setex('BTC_DAILY', 3600, JSON.stringify(data_BTC.data['Time Series (Digital Currency Daily)']));
  }).catch(error => {
    console.log('Something went wrong updating the BTC daily data', error);
  });
  axios.get(`${API}function=DIGITAL_CURRENCY_DAILY&symbol=ETH&market=USD&apikey=${API_KEY}`).then(data_ETH => {
    console.log('ETH daily data updated');
    client.setex('ETH_DAILY', 3600, JSON.stringify(data_ETH.data['Time Series (Digital Currency Daily)']));
  }).catch(error => {
    console.log('Something went wrong updating the ETH daily data', error);
  });
};

const monthlyRequests = () => {
  axios.get(`${API}function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=USD&apikey=${API_KEY}`).then(data_BTC => {
    console.log('BTC Monthly data updated');
    client.setex('BTC_MONTHLY', 86400, JSON.stringify(data_BTC.data['Time Series (Digital Currency Monthly)']));
  }).catch(error => {
    console.log('Something went wrong updating the BTC monthly data', error);
  });
  axios.get(`${API}function=DIGITAL_CURRENCY_MONTHLY&symbol=ETH&market=USD&apikey=${API_KEY}`).then(data_ETH => {
    console.log('ETH Monthly data updated');
    client.setex('ETH_MONTHLY', 86400, JSON.stringify(data_ETH.data['Time Series (Digital Currency Monthly)']));
  }).catch(error => {
    console.log('Something went wrong updating the ETH monthly data', error);
  });
};

// Simulate Error
const simulateError = (request) => {
  let retry = true;
  while(retry) {
    if (Math.random(0, 1) < 0.1) {
      console.log('request fail retry');
      setTimeout(()=>{}, 3000)
    } else {
      request;
      retry = false;
    }
  }
};


// Cron jobs
const subscriberMonth = cronMonthly.subscribe( () =>{
  simulateError(monthlyRequests());
});

const subscriberDay = cronDaily.subscribe( () => {
  simulateError(dailyRequests());
});




const headers = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10,
    "Content-Type": "application/json"
};

const respond = function(res, data, status) {
    status = status || 200;
    res.writeHead(status, headers);
    res.end(data);
};

const send404 = function(res) {
    respond(res, JSON.stringify({error: 'Not Found'}), 404);
};


// Routes
const actions = {
    'GET': (req, res) => {
        const parsedUrl = url.parse(req.url);
        const endPoint = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;

        if (endPoint === '/index.html') {
            // render page
            console.log('render html')
        } else {
            const splitEndpoint = endPoint.split('/');
            console.log('Endpoints');
            console.log(splitEndpoint);
            if (splitEndpoint[1] === 'api' && splitEndpoint.length === 4) {
                // It's an api like endpoint
                if ( splitEndpoint[2] === 'btc') {

                    // It's a BTC endpoint
                    if (splitEndpoint [3] === 'daily') {
                        // It's a BTC daily endpoint
                        client.get('BTC_DAILY', (error, result) => {
                            const data = result;
                            const statusCode = 200;
                            respond(res, data, statusCode);
                        });
                    } else if (splitEndpoint [3] === 'monthly') {
                        // It's a BTC monthly endpoint
                        client.get('BTC_MONTHLY', (error, result) => {
                            const data = result;
                            const statusCode = 200;
                            respond(res, data, statusCode);
                        });
                    } else {
                        // invalid btc endpoint
                        send404(res)
                    }

                } else if (splitEndpoint[2] === 'eth') {
                    // It's an ETH endpoint
                    if (splitEndpoint [3] === 'daily') {
                        // It's a ETH daily endpoint
                        client.get('ETH_DAILY', (error, result) => {
                            const data = result;
                            const statusCode = 200;
                            respond(res, data, statusCode);
                        });
                    } else if (splitEndpoint [3] === 'monthly') {
                        // It's a ETH monthly endpoint
                        client.get('ETH_MONTHLY', (error, result) => {
                            const data = result;
                            const statusCode = 200;
                            respond(res, data, statusCode);
                        });
                    } else {
                        // invalid ETH endpoint
                        send404(res)
                    }

                } else {
                    // It's not and valid api endpoint
                    send404(res);
                }
            } else {
                // Non valid api
                send404(res)
            }
        }
    }
};

exports.handleRequest = (req, res) => {
    const action = actions[req.method];
    action ? action(req, res) : send404(res);
};