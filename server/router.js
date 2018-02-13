const url = require('url');
const rx = require('rxjs');
const axios = require('axios'); // declare axios for making http requests
const cronDaily = rx.Observable.timer(1, 3600); //Updater BTC
const cronMonthly = rx.Observable.timer(1, 86400); //Updater ETH
const API = 'https://www.alphavantage.co/query?';

const API_KEY = 'C3DOJ8C4CTA9Z14Q';
const redis = require("redis"), client = redis.createClient({port: 6379});

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error on redis connect" + err);
});

client.on("success", () => {
    console.log("Sucess on redis connect" + err);
});
// Once connected update currency data
const subscriberDay = cronDaily.subscribe( () => {
    axios.get(`${API}function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${API_KEY}`).then(data_BTC => {
        // console.log('BTC', data_BTC.data);
        // client.setex('BTC_DAILY', 3600, JSON.stringify(data_BTC.data['Time Series (Digital Currency Daily)']));
    }).catch(error => {
        console.log('Something went wrong updating the BTC daily data', error);
    });
    axios.get(`${API}function=DIGITAL_CURRENCY_DAILY&symbol=ETH&market=USD&apikey=${API_KEY}`).then(data_ETH => {
        // client.setex('ETH_DAILY', 3600, JSON.stringify(data_ETH.data['Time Series (Digital Currency Daily)']));
    }).catch(error => {
        console.log('Something went wrong updating the ETH daily data', error);
    });
});

const subscriberMonth = cronMonthly.subscribe( () => {
    axios.get(`${API}function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=USD&apikey=${API_KEY}`).then(data_BTC => {
        console.log('BTC', data_BTC.data);
        // client.setex('BTC_MONTHLY', 86400, JSON.stringify(data_BTC.data['Time Series (Digital Currency Daily)']));
    }).catch(error => {
        console.log('Something went wrong updating the BTC monthly data', error);
    });
    axios.get(`${API}function=DIGITAL_CURRENCY_MONTHLY&symbol=ETH&market=USD&apikey=${API_KEY}`).then(data_ETH => {
        // console.log('ETH', data_ETH.data['Meta Data']);
        //client.setex('ETH_MONTHLY', 86400, data_ETH.data);
    }).catch(error => {
        console.log('Something went wrong updating the ETH monthly data', error);
    });
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
    respond(res, 'Not Found', 404);
};

const actions = {
    'GET': (req, res) => {

        const parsedUrl = url.parse(req.url);
        const endPoint = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;

        client.get('ETH_DAILY', (error, result) => {
            const data = result;
            const statusCode = 200;
            respond(res, data, statusCode);
        });


            console.log(parsedUrl, endPoint)

    }
};

exports.handleRequest = (req, res) => {
    const action = actions[req.method];
    action ? action(req, res) : send404(res);
};