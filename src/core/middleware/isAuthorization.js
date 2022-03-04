'use strict';
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
    
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return sendResponse({error: {valid: false}, message: "Access denied. No token provided."}, 401);
  try {
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.APP_KEY);
    let authId = decoded.foo.id;
    let user = await modules.auth.services.auth.findBaseById(authId);
    user = {
        id: authId,
        name: user.name,
        email: user.email,
        role: await modules.auth.services.roles.getUserRoleAndPermissions(authId),
        mobile: user.mobile,
    };
    console.log(user)
    global.auth = user;
    req.user = user;
    next();
  } catch (ex) {
    return sendResponse({error: {valid_token: false}, message: "Invalid access token"}, 401);
  }
};