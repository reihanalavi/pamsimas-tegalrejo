var express = require('express');
var router = express.Router();

const { akun, createakun, akunById, updateakunById, deleteakunById } = require('./controller')

// const { isLoginAdmin } = require('../middleware/auth')
// router.use(isLoginAdmin)

router.get('/akun', akun)
router.post('/akun', createakun)
router.get('/akun/:username/detail', akunById)
router.put('/akun/:username/detail', updateakunById)
router.delete('/akun/:username', deleteakunById)

module.exports = router;