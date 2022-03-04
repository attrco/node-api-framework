'use strict';
let Validator = require('validatorjs');

module.exports = {

    login: async(req, res) => {
        
        let body = req.body;
        let rules = {
            email: "required",
            password: "required",
        };
    
        let validation = new Validator(body, rules);
        if (validation.fails()) return sendResponse({error: validation.errors.errors}, 422);

        let result = await modules.auth.services.auth.login(body.email, body.password);
        if(! result) return sendResponse({error: { is_valid: true }, message: "Invalid email or password"}, 401); 
        console.log(result)
        return sendResponse({ result: result})

    },

    registration: async(req, res) => {

        let body = req.body;
        let rules = {
            name: "required|max:225",
            mobile: "required|digits_between:10,10",
            password: "required|min:6|confirmed",
            password_confirmation: "required"
        };
    
        let validation = new Validator(body, rules);
        if (validation.fails()) return sendResponse({error: validation.errors.errors}, 422);

        //Create user
        let result = await modules.auth.services.auth.register(body);
        if(result.error) return sendResponse({error: result.error, message: result.message}, 422); 

        return sendResponse({...result})
    }
}   

