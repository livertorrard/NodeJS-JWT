const express = require('express');
const route = express.Router();
const users = require('../models/user.model.js');
const createError = require('http-errors');
const userValidate = require('../helpers/validation');
const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../helpers/jwt.service');
const client = require('../helpers/connections_redis.js');

route.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = userValidate({ email, password });

        if (error) throw createError.BadRequest(err.message);
        if (!email || !password) throw createError.BadRequest('Please enter a username and password');

        const isExists = await users.exists({ email });
        if (isExists) throw createError.BadRequest("Already registered");

        const user = new users({ email, password });
        const isCreated = await user.save();

        return res.json(isCreated);
    }
    catch (err) {
        next(err);
    }
});

route.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreToken } = req.body;
        const { userId } = await verifyRefreshToken(refreToken);

        const accessToken = await signAccessToken(userId);
        const refreshToken = await signRefreshToken(userId);

        res.json({ accessToken, refreshToken });
    }
    catch (err) { next(err); }
});

route.post('/login', async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const { error } = userValidate({ email, password });
        if (error) {
            throw createError.BadRequest(err.message);
        }

        const user = await users.findOne({ email });
        if (!user) { throw createError.NotFound(err.message) };

        const isCheckPassword = await user.isCheckPassword(password);
        if (!isCheckPassword) { throw createError.Unauthorized() }

        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);

        res.json({ accessToken, refreshToken });


    } catch (error) { next(error); };
});

route.get('/list-users', verifyAccessToken, (req, res) => {
    const users = [{
        email: 'VQ'
    }, { email: 'BVVQ' }];

    res.json(users);
});

route.delete('/logout', async (req, res, next) => {
    const { refreToken } = req.body;
    if (!refreToken) {
        throw createError.BadRequest();
    }

    const { userId } = await verifyRefreshToken(refreToken)
    client.del(userId.toString(), (err, reply) => {
        if (err) {
            throw createError.BadRequest();
        }
        res.json({
            message: 'Logout successfully!'
        })
    });
});

module.exports = route;
