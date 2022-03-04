'use strict';

module.exports = function (req, res, next) {
    global.appRequest = req;
    global.appResponse = res;
    next();
};