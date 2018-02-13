const url = require('url');

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



        console.log(parsedUrl, endPoint)
        const data = JSON.stringify({hello: 'its me again'});
        const statusCode = 200;
        respond(res, data, statusCode);
    }
};

exports.handleRequest = (req, res) => {
    const action = actions[req.method];
    action ? action(req, res) : send404(res);
};