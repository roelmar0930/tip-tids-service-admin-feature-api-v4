const jwt = require('jsonwebtoken');
const creds = require('../creds.json');
//const logger = require('./logger/logManager');
require('dotenv').config();

const jwtAuthenticator = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, creds.web.client_secret);
        //logger.info('Decoding JWT token successful');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

module.exports = jwtAuthenticator;
