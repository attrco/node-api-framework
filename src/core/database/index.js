var mongoose = require('mongoose');

var env = process.env;

connectDB = () => {
    console.log('----------------------------------------------------------')
    switch (env.DATABASE) {
        case 'mongoDB':
            var options = {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                // useCreateIndex: true,
            }
            console.log('\x1b[33m%s\x1b[0m', 'MongoDB connecting...');
            mongoose.connect(`mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`, options, (error, success) => {
                if(error)
                    return console.log('MongoDB Error: ', error);
                return console.log('\x1b[32m%s\x1b[0m', 'MongoDB connected successfully...');
            });
            break;
    
        default:
            break;
    }
    
}

module.exports = {
    connectDB
}