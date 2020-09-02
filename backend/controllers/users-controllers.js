const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");
const User = require('../models/user')

async function gerUsers(req, res, next) {
    let users;

    try {
        users = await User.find({}, '-password')
    } catch (e) {
        return next(new HttpError("Fetching users failed, please try again later", 500))
    }

    await res.json({users: users.map(user => user.toObject({getters: true}))})
}

async function signUp(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const {name, userName, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email, userName: userName},);
    } catch (e) {
        return next(new HttpError(e, 500));
    }

    if (existingUser) {
        return next(new HttpError('User exists already, please login instead.', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
        return next(new HttpError('Could not create user, please try again.', 500));
    }

    const createdUser = new User({
        name,
        userName,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            err,
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({
            userId: createdUser.id,
            email: createdUser.email,
            userName: createdUser.userName
        }, `${process.env.JWT_KEY}`, {expiresIn: '1h'});
    } catch (e) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    await res
        .status(201)
        .json({userId: createdUser.id, email: createdUser.email,userName: createdUser.userName, token: token});
}

async function login(req, res, next) {
    const {userName, password} = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({userName: userName})
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    let isValidPassword = false;

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id,
            email: existingUser.email,
            userName: existingUser.userName
        }, `${process.env.JWT_KEY}`, {expiresIn: '1h'});
    } catch (e) {
        return next(new HttpError('Logging in failed, please try again.', 500));
    }


    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (e) {
        return next(new HttpError("Could not log you in, please check you credentials and try again", 500))
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    await res.json({
        userId: existingUser.id,
        email: existingUser.email,
        userName: existingUser.userName,
        token: token
    });
}

exports.gerUsers = gerUsers;
exports.signup = signUp;
exports.login = login;