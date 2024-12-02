var express = require('express');
var router = express.Router();

const { pengaduan, createpengaduan, pengaduanByIdMeteran, pengaduanById, updatepengaduanById, deletepengaduanById } = require('./controller')

// const { isLoginAdmin } = require('../middleware/auth')
// router.use(isLoginAdmin)

router.get('/pengaduan', pengaduan)
router.post('/pengaduan', createpengaduan)
router.get('/pengaduan/:idMeteran', pengaduanByIdMeteran)
router.get('/pengaduan/:idPengaduan/detail', pengaduanById)
router.put('/pengaduan/:idPengaduan/detail', updatepengaduanById)
router.delete('/pengaduan/:idPengaduan', deletepengaduanById)

module.exports = router;