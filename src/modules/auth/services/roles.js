'use strict';

const Roles = require('../model/roles')

module.exports = {

    getUserRoleAndPermissions: async(id) => {
        let result = await Roles.findOne({id}).exec();
        return result;
    },

    findById: async(id) => {
        let result = await Roles.findOne({id}).exec();
        return result;
    },

    checkRole: async(role) => {
        let result = await Roles.findOne({prefix: role}).exec();
        return result;
    },

    create: async ({ name, prefix, grant_permissions, permissions = "" }) => {
        let role = await Roles.findOne({name, prefix})
    
        if(! role)
            role = new Roles({name, prefix, permissions, grant_permissions}).save();
        return role;
    },

    update: async(id, params) => {
        await Roles.updateOne({_id: id}, {$set: params });
        return true;
    }
}