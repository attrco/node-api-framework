const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;
var moment = require("moment");

activityLogger = (d, level = "info") => {
    const myFormat = printf(({ timestamp }) => {
        return `${timestamp} [action: ${d.action}] [module: ${d.module}] [user: ${d.user}] ${level}: ${d.message}`;
    });

    const logger = winston.createLogger({
        format: combine(timestamp(), myFormat),
        transports: [
            new winston.transports.File({
                filename:
                    "./src/Logs/" +
                    moment().format("YYYY-MM") +
                    "-activity.log",
            }),
        ],
    });

    logger.log({
        level: level,
        message: d.message,
    });
};

module.exports = activityLogger;
