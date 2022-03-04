'use strict';
let Validator = require('validatorjs');

module.exports = {

    authUserRole: async(req, res) => {

        let result = await modules.auth.services.roles.findById(auth.id);
        return sendResponse({result});
    },

    create: async(req, res) => {
        let body = req.body;
        if(body.length) {

            for (let i = 0; i < body.length; i++) {
                const roles = body[i];
                await modules.auth.services.roles.create(roles)
            }
        }
        return sendResponse({result: body});
    },

    update: async(req, res) => {

        let params = req.params;
        let body = req.body;

        await modules.auth.services.roles.update(params.id, body)
        return sendResponse({result: {
            id: params.id,
            ...body
        }});
    }
}