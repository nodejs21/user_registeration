const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:root@ds159274.mlab.com:59274/user_profiles', {
    useMongoClient: true
});

module.exports = {mongoose};