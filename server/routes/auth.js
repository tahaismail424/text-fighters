var express = require('express');
var router = express.Router();

var user_controller = require("../controllers/userController");

router.post('/create', user_controller.user_create);

router.post('/login', user_controller.user_authenticate, user_controller.user_authenticate_callback);

router.get('/logout', user_controller.user_logout);


module.exports = router;