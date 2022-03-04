
var requestStats = require('request-stats')
var app = require('./app');
const httpServices = require('http');
const moment = require('moment')

const port = process.env.APP_PORT;
const httpServer = httpServices.createServer(app);


var io = require('socket.io');

io = io(httpServer, {
    cors: {
      origin: '*',
    }
});
app.use(function(req, res, next) {
    req.io = io;
    next();
});
var socketRoute = require('./socket')(io);
app.use('/', socketRoute);

requestStats(httpServer, function (stats) {
    let statusCode = stats.res.status;
    let path = stats.req.path;
    let method = stats.req.method;

    switch (method) {
        case 'POST':
            method = `\x1b[93m${method}\x1b[39m`;
            break;

        case 'GET':
            method = `\x1b[32m${method}\x1b[39m`;
            break;

        case 'PUT':
            method = `\x1b[34m${method}\x1b[39m`;
            break;

        case 'DELETE':
            method = `\x1b[31m${method}\x1b[39m`;
            break;
    
        default:
            break;
    }

    switch (statusCode) {
        case 404:
            statusCode = `\x1b[31m${statusCode}\x1b[39m`
            break;

        case 200:
            statusCode = `\x1b[32m${statusCode}\x1b[39m`
            break;
    
        default:
            break;
    }

    // console.log(`[${moment()}]`, method, path, statusCode)
});

httpServer.listen(port, () => {
    console.log(`Application running on ${process.env.APP_BASE_URL}`);
})