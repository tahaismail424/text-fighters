const passport = require("passport");
const axios = require("axios");
const async = require("async");
const LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user');

exports.user_get_data = function(req, res, next) {
    User.findOne({ username: req.username })
        .then((user) => {
            if (!user) return res.status(404);
            return res.json(user);
        })
        .catch(err => next(err));
}

exports.user_create = function(req, res, next) {

    // create user from form data
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        desc: "",
        friendList: []
    });

    // validate email
    function validateEmail(callback) {
        // first check if email already in use in user database
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    // if new email, check if email is valid with mailboxlayer API
                    axios.get(`http://apilayer.net/api/check?access_key=${"e1a560b5fa0b360f1451e643cb4d5259"}&email=${req.body.email}`)
                    .then((response) => {
                        // smtp_check not working for my valid email.. strange
                        const { format_valid, mx_found } = response.data;
                        const isValidEmail = format_valid && mx_found;
                        if (!isValidEmail) {
                            const error = new Error('Email is not valid. Please enter a valid email');
                            callback(null, error);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
                else {
                    const error = new Error('Email already in use for an account. Please enter a different email');
                    callback(null, error);
                }
            });
    }

    // validate username
    function validateUsername(callback) {
        // first check if username already in use in user database
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (!user) {
                    // check if username has at lease one letter and is less than 16 characters
                    const regex = /[a-zA-Z]/;
                    const isValidUsername = regex.test(req.body.username) && req.body.username.length > 0 && req.body.username.length < 16;
                    if (!isValidUsername) {
                        const error = new Error("Username does not meet specifications. Username must not be empty, must not be greater than 15 characters, and must contain at least one letter");
                        callback(null, error);
                    }
                    else {
                        callback(null);
                    }
                }
                else {
                    const error = new Error("Username is already taken. Please enter a different username");
                    callback(null, error);
                }
            });
    }

    // validate password w/ below specified parameters
    function validatePassword(callback) {
        const regLower = /[a-z]/;
        const regUpper = /[A-Z]/;
        const regDig = /\d/;
        const regSpec = /[!@#$%^&*()\-=_+{}[\]|;:',.<>/?]/;
        
        const isValidPassword = regLower.test(req.body.password) 
            && regUpper.test(req.body.password)
            && regDig.test(req.body.password)
            && regSpec.test(req.body.password)
            && req.body.password.length >= 8
            && req.body.password.length <= 100

        if (!isValidPassword) {
            const error = new Error("Password is not valid. Password must satisfy following conditions: At least 8 characters, must contain lowercase letter, must contain uppercase letter, must contain digit, must contain special character");
            callback(null, error);
        }
        else if (req.body.password !== req.body.confirm) {
            const error = new Error("Passwords must match");
            callback(null, error);
        }
        else {
            callback(null);
        }
    }

    // validate all fields in parallel
    async.parallel({
        emailCheck: (callback) => validateEmail(callback),
        usernameCheck: (callback) => validateUsername(callback),
        passwordCheck: (callback) => validatePassword(callback)

        // if errors, send the errors in response to client
    }, (errors, results) => {
        let errorList = []
        if (results.emailCheck) errorList.push(results.emailCheck.message);
        if (results.usernameCheck) errorList.push(results.usernameCheck.message);
        if (results.passwordCheck) errorList.push(results.passwordCheck.message);
        if (errorList.length != 0) {
            const error = {
                messages: errorList,
                statusCode: 400
            }
            res.statusCode = error.statusCode;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(error));
        }
        // if there are not errors, save the new user to the database
        user.save()
            .then((saved) => res.json(saved))
            .catch((err) => next(err));
    }); 
};

exports.user_strategy = new 
LocalStrategy((username, password, done) => {
    User.findOne({ username: username})
        .then((user) => {
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password"});
            }
            return done(null, user);
        })
        .catch((err) => done(err));
    });


exports.user_serialize = function(user, done) {
    done(null, user.id);
}

exports.user_deserialize = function(id, done) {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err));
}

exports.user_authenticate = passport.authenticate("local");

exports.user_authenticate_callback = function(req, res, next) {
    if (req.user) {
        res.json(req.user);
    } else {
        res.statusCode = 401;
        res.json({ statsCode: 401, message: 'Username or password is incorrect.'});
    }
}

exports.user_send_info_auth = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.json(req.user);
    }
    return res.status(401);
  }

exports.user_logout = function(req, res, next) {
res_data = { status: 0 };
req.logout(function(err) {
    if (err) {
    res_data.status = 403;
    res.json(res_data);
    return next(err)
    }
    res_data.status = 205;
    res.json(res_data);
});
}