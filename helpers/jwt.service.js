const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('./connections_redis');

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId }
        const secret = process.env.ACCESS_TOKEN;
        const options = {
            expiresIn: '1m'
        };

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
}

const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId }
        const secret = process.env.REFRESH_TOKEN;
        const options = {
            expiresIn: '1h'
        };

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);

            client.set(userId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                if (err) reject(createError.InternalServerError());
                resolve(token);
            })
        });
    })
}

const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized());
    }

    const token = req.headers['authorization'].split(' ')[1];
    JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(createError.Unauthorized());
            } return next(createError.Unauthorized(err.message));

        }
        req.payload = payload;
        next();
    });
};

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
            if (err) {
                return reject(err);
            }

            client.get(payload.userId, (err, reply) => {
                if (err) {
                    return reject(createError.InternalServerError());
                } else if (reply === refreshToken) {
                    return resolve(payload);
                }
            });
        });
    });
}

module.exports = { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken };