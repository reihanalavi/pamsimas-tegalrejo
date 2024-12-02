var express = require('express');
var router = express.Router();

const { generateExcelTagihan, tagihan, tagihanNow, countNow, tagihanByMonth, createtagihan, tagihanByIdMeteran, tagihanByIdTagihan, updatetagihanById, deletetagihanById, generatetagihan, generatetagihanoncustommonth } = require('./controller')

// const { isLoginAdmin } = require('../middleware/auth')
// router.use(isLoginAdmin)

router.get('/tagihan', tagihan)
router.get('/generatetagihan', generateExcelTagihan)
router.get('/tagihan/now', tagihanNow)
router.get('/tagihan/countnow', countNow)
router.get('/tagihan/:tahunTagihan/:bulanTagihan', tagihanByMonth)
router.post('/tagihan', createtagihan)
router.post('/tagihan/generate', generatetagihan)
router.post('/tagihans/generate', generatetagihanoncustommonth)
router.get('/tagihan/meteran/:idMeteran/detail', tagihanByIdMeteran)
router.get('/tagihan/id/:idTagihan/detail', tagihanByIdTagihan)
router.put('/tagihan/:idTagihan/detail', updatetagihanById)
router.delete('/tagihan/:idTagihan', deletetagihanById)

module.exports = router;