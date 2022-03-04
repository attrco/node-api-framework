const path = require('path');
const fs = require('fs');
const isAuthorization = require('./middleware/isAuthorization');
const appMiddleware = require('./middleware/appMiddleware');
const rateLimit = require("express-rate-limit");

let config = "";
initRoute = async (app) => {
    config = app;

    generateModuleRoute('modules');
}

const apiLimiter = rateLimit({
    windowMs: 30000, // 15 minutes
    max: 10
});

function generateModuleRoute (modulePath) {

    if(!process.env.API_VERSION === undefined) throw new Error('Missing api version "API_VERSION" in env file')
    let middleware = [appMiddleware];
    fs.readdir(__rootDir + '/' + modulePath, (err, files) => {

        if(! files) throw new Error('Module not found')

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let routeFile = __rootDir + '/' + modulePath +'/' + file + '/config/route.json';
            let controller = __rootDir + '/' + modulePath +'/' + file + '/controllers';
            routeFile = require(routeFile);
            let routes = routeFile.routes;
            for (let index = 0; index < routes.length; index++) {
                let endPoint = '/api/' + process.env.APP_API_VERSION + '/' + file;
                const route = routes[index];
                let routeSplit = route.action.split('.');
                let controllerName = controller + '/' + routeSplit[0] + '.js';
                let moduleController = require(controllerName);
                
                if(route.policies) {
                    try {
                        if(route.policies.authorization)
                            middleware.push(isAuthorization)
                    } catch (error) {
                        
                    }
                }

                try {
                    endPoint = endPoint + route.path;
                    config[route.method.toLowerCase()](endPoint, middleware, moduleController[routeSplit[1]]);
                } catch (error) {
                    throw new Error(routeSplit[1] + ' Method not found in ' + routeSplit[0] + ' ' + controllerName, error)
                }
            }
        }
        
        config.use((req, res, next) => {
            res.status(404).send(
                {
                    status: false,
                    error: "Not Found",
                    message: "ERROR: The requested api does not exist.",
                }
            );
            // next();
        });
    });
}

module.exports = {
    initRoute,
};