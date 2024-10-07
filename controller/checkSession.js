const session = require('./session.js');

const checkSession = (req, res, next) => {
    const sessionId = req.headers.cookie?.split('=')[1];
    if (session[sessionId]) {
        next();
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
}

module.exports = checkSession;