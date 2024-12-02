var express = require('express');
var router = express.Router();

const { generateExcelPelanggan, pelanggan, getPelangganByRTRW, createPelanggan, createPelanggans, pelangganById, updatePelangganById, deletePelangganById, generateQRbyId } = require('./controller')

// const { isLoginAdmin } = require('../middleware/auth')
// router.use(isLoginAdmin)

router.get('/pelanggan', pelanggan)
router.get('/generatepelanggan', generateExcelPelanggan)
router.get('/pelangganRTRW', getPelangganByRTRW)
router.post('/pelanggan', createPelanggan)
router.post('/pelanggans', createPelanggans)
router.get('/pelanggan/:idMeteran/detail', pelangganById)
router.get('/pelanggan/:idMeteran/generate', generateQRbyId)
router.put('/pelanggan/:idMeteran/detail', updatePelangganById)
router.delete('/pelanggan/:idMeteran', deletePelangganById)

module.exports = router;