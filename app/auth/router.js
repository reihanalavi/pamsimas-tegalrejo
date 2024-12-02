var express = require('express');
var router = express.Router();
const { actionSignIn, actionLogout } = require('./controller');

router.post('/', actionSignIn);
router.get('/logout', actionLogout);

module.exports = router;