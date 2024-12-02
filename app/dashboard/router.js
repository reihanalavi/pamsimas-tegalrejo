var express = require('express');
var router = express.Router();
const { dashboard, getPemasukanCustom } = require('./controller');

router.get('/dashboard', dashboard);
router.get('/dashboard/:tahunTagihan/:bulanTagihan', getPemasukanCustom);

module.exports = router;