const async = require("async");

var User = require('../models/user');
var FriendReq = require('../models/friendReq');

exports.friend_send_request = function(req, res, next) {
    // search for given user in database
    User.findOne({ username: req.body.username })
        // if not found, send error that the given user does not exist
        .then(user => {
            if (!user) {
                const error = {
                    statusCode: 404,
                    message: "User does not exist. Please double check the username of your friend."
                }
                res.statusCode = error.statusCode;
                return res.json(error);
            }
            // if found, check if request between these two users already exists
            async.parallel({
                forwardCheck: (callback) => FriendReq.findOne({ sender: req.user._id, recipient: user._id }).then(result => callback(null, result)),
                backwardCheck: (callback) => FriendReq.findOne({ sender: user._id, recipient: req.user._id }).then(result => callback(null, result))
            }, function(errors, results) {
                if (errors) return next(errors);
                if (results.forwardCheck || results.backwardCheck) {
                    // if so, send error that request already exists
                    const error = {
                        statusCode: 409,
                        message: "Friend request already exists with this user. Please check your request list."
                    };
                    res.statusCode = error.statusCode;
                    return res.json(error);
                }
                if (req.user.id == user.id) {
                    // cannot send friend request to yourself
                    const error = {
                        statusCode: 409,
                        message: "You cannot send a friend request to yourself!"
                    };
                    res.statusCode = error.statusCode;
                    return res.json(error);
                }
                 // if not, create request object
                const request = new FriendReq({
                    sender: req.user,
                    recipient: user,
                    status: 'pending',
                    createdAt: Date.now()
                });
                request.save()
                    .then(saved => res.json(saved))
                    .catch(err => next(err));
            });
        })
        .catch(err => next(err));
}

exports.friend_accept_request = function(req, res, next) {
    // change request status to accepted
    FriendReq.findByIdAndUpdate(req.body.id, { status: 'accepted'}, { new: true })
        .then(request => {
            // add users to each other's friends list
            async.parallel({
                senderAdd: (callback) => User.findByIdAndUpdate(request.sender._id, { friendList: request.sender.friendList.concat(request.recipient._id) }, { new: true }).then(result => callback(null)),
                recipientAdd: (callback) => User.findByIdAndUpdate(request.recipient._id, { friendList: request.recipient.friendList.concat(request.sender._id) }, { new: true }).then(result => callback(null))
            }, (err, results) => {
                if (err) return next(err);
            });
            return res.json(request);
        })
        .catch(err => next(err));
}

exports.friend_reject_request = function(req, res, next) {
    // change request status to rejected
    FriendReq.findByIdAndUpdate(req.body.id, { status: 'reject'}, { new: true })
        .then(request => res.json(request))
        .catch(err => next(err));
}

exports.friend_list_requests = function(req, res, next) {
    // search for all requests with user as sender or recipient,
async.parallel({
        asSender: (callback) => FriendReq.find({ sender: req.user.id }).populate('recipient').sort('-date').then(result => callback(null, result)),
        asRecipient: (callback) => FriendReq.find({ recipient: req.user.id }).populate('sender').sort('-date').then(result => callback(null, result))
    }, (err, results) => {
        if (err) return next(err);
        // send list as JSON to client
        return res.json({ asRecipient: results.asRecipient, asSender: results.asSender });
    });
}

exports.friend_dismiss_request = function(req, res, next) {
    FriendReq.findByIdAndDelete(req.body.id)
        .then(del => res.send("Request update acknowledged"))
        .catch(err => next(err));
}