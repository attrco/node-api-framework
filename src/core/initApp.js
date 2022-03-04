const fs = require('fs');
const app = require('../app');
const helpers = require('./utility');

configureApp = async (req) => {
    global.mongoDbDisableId = helpers.mongoDbDisableId;

    await initApp()
}

async function initApp() {
    let modulePath = __rootDir + '/modules';
    return new Promise((resolve, reject) => {
        fs.readdir(modulePath, (err, files) => {
            let modules = {};
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let servicePath = modulePath + '/' + file + '/services';
                let controllerPath = modulePath + '/' + file + '/controllers';
                
                Object.assign(modules, {
                    [file]: {
                        controller: {},
                        services: {}
                    }
                });

                fs.readdir(controllerPath, (err, files) => {
                    if(files) {
                        for (let k = 0; k < files.length; k++) {
                            const srv = files[k];
                            modules[file] = {
                                ...modules[file],
                                controller: {
                                    ...modules[file].controller,
                                    [srv.split('.')[0]]: require(controllerPath + '/' + srv)
                                }
                            }
                        }
                    }
                })

                fs.readdir(servicePath, (err, files) => {
                    if(files) {
                        for (let k = 0; k < files.length; k++) {
                            const srv = files[k];
                            modules[file] = {
                                ...modules[file],
                                services: {
                                    ...modules[file].services,
                                    [srv.split('.')[0]]: require(servicePath + '/' + srv)
                                }
                            }
                        }
                    }
                })
                

                // fs.readdir(servicePath, (err, files) => {
                //     if(files) {
                //         for (let k = 0; k < files.length; k++) {
                //             const srv = files[k];
                //             modules[file] = {
                //                 ...modules[file],
                //                 services: {
                //                     [srv.split('.')[0]]: require(servicePath + '/' + srv)
                //                 },
                //             }
                //         }
                //     }
                // })
                
            }

            setTimeout(() => {
                global.modules = modules;
                global.helpers = helpers;
                global.url = helpers.url;
                global.sendResponse = helpers.sendResponse;
                global.request = helpers.request;
                global.logger = require("./logger");

            })

            resolve({id: 1});
        })
    });
}


module.exports = {
    configureApp
}