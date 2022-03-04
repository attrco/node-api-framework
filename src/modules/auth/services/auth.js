'use strict';

const { token, generatePassword } = require('../../../core/utility');
const Users = require('../model/users')
const bcrypt = require('bcryptjs');

module.exports = {

    login: async(email, password) => {
        
        let result = await modules.auth.services.auth.findUserByField({email}, 'id name email mobile password');
        let validatePassword = await bcrypt.compare(password, result.password.replace("$2y", "$2a"))
        if(validatePassword) {
            let jwt = token({id: result.id, role: result.role});
            result = {
                access_token: jwt,
                access_type: 'Bearer',
                user: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    mobile: result.mobile,
                    role: result.role
                }
            }
            return result;
        }
    },

    register: async ({name, email, mobile, password, role = ""}) => {

        //check role is available or not
        role = await modules.auth.services.roles.checkRole(role);
        if(! role) return {error: { is_role: false }, message: "This role not available. Please check or select a role"}

        //Check email already exist not
        let user = await modules.auth.services.auth.findUserByField({email});
        if(user) return {error: { is_exist: true }, message: "The email already exist."}

        let result = "";
        try {
            password = generatePassword(password)
            result = await new Users({name, email, password, mobile, register_no: await generateRegisterNo(), role: role.id}).save();
            logger({
                action: "create",
                user: "app configuration",
                module: "auth/service/auth",
                message: "create new user [ref: " + result.id + " | name: " + result.name + "]",
            });
        } catch (error) {
            logger({
                action: "Error",
                user: "app configuration",
                module: "auth/service/auth",
                message: error,
            });

            throw error;
        }

        result = await modules.auth.services.auth.findUserByField({id: result.id}, 'id name email mobile');

        return {
            result,
            message: "User created successfully completed."
        }
    },

    findUserByField: async(field, select = 'id name email mobile') => {
        console.log(field, 'field')
        let result = await Users.aggregate(
            [
                { $match: field },
                {
                    $lookup: {
                        from: 'roles_permissions',
                        localField: 'role',
                        foreignField: '_id',
                        as: 'roles'
                    }
                },
                { $unwind: "$roles" },
                {
                    $project: {
                        id: "$_id",
                        password: 1,
                        name: 1,
                        email: 1,
                        mobile: 1,
                        role: {
                            id: "$roles._id",
                            name: "$roles.name",
                            // permissions: "$roles.permissions" 
                        }
                    }
                }
            ]
        );

        return (result.length > 0) ? result[0] : '';
    },

    findBaseById: async(id) => {

        return await Users.findOne({_id: id}, '_id name email mobile role').exec();
    }
}


async function generateRegisterNo() {
    let d = await Users.find().count();
    d = d + 1;
    var str = "" + d;
    var pad = "0000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    return "RGU-" + ans;
}