const express = require('express')
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const path = require('path');
const { initRoute } = require('./core/initRoute');
const { configureApp } = require('./core/initApp');
const database = require("./core/database");

const app = express();

global.__rootDir = __dirname;

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

initRoute(app);
configureApp();

database.connectDB();

module.exports = app;