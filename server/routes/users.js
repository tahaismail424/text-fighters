var express = require('express');
var router = express.Router();

var user_controller = require("../controllers/userController");

router.get('/cur-user', user_controller.user_send_info_auth);

router.get('/:username', user_controller.user_get_data);

module.exports = router;
