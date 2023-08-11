var express = require('express');
var router = express.Router();

var friend_controller = require("../controllers/friendController");

router.post('/send', friend_controller.friend_send_request);

router.patch('/accept', friend_controller.friend_accept_request);

router.patch('/reject', friend_controller.friend_reject_request);

router.get('/list', friend_controller.friend_list_requests);

router.delete('/dismiss', friend_controller.friend_dismiss_request);

module.exports = router;
