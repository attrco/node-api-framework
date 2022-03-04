'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {

    token: (result, exp = "6d") => { 
        const token = jwt.sign({ foo: result, iat: Math.floor(Date.now() / 1000) - 50 }, process.env.APP_KEY, { expiresIn: exp }); 
        return token;
    },

    generatePassword: (password = Date.now().toString()) => {
        return bcrypt.hashSync(password, 10).replace("$2b", "$2y");
    },

    verifyPassword: (password = Date.now().toString()) => {
        return bcrypt.hashSync(password, 10).replace("$2b", "$2y");
    },

    url: (url = "") => {
        return process.env.APP_BASE_URL
    },

    sendResponse: ({status = true, result = "", error = "", message = "Success"} = "", code = 200) => {

        let data = {}

        data.status = status;

        if(error)
            data.error = error;

        if(result)
            data.result = result;

        if(! error && ! result)
            data.result = "";

        data.message = message;
        data.timestamp = new Date();

        return appResponse.status(code).send(data)
    },

    request: () => {
        return appRequest;
    },
    
    mongoDbDisableId: async (schema) => {
        await schema.set('toJSON', {
            transform: function (doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        });
    }
}