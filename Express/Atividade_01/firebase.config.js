const fs = require('firebase-admin')

const ServiceAccount = require('./first-steps-87959-firebase-adminsdk-swosw-45788290d9.json')

fs.initializeApp({
    credential: fs.credential.cert(ServiceAccount),
});

module.exports = fs;