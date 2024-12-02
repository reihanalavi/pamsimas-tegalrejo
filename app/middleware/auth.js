// const config = require('../../config')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// module.exports = {
//     isLoginAdmin: (req, res, next) => {
//         if(req.session.user === null || req.session.user === undefined) {
//             res.status(500).json({
//                 message: "Session anda sudah habis",
//                 title: 'Terjadi kesalahan'
//             })
//             console.log('Tidak ada session')
//         } else {
//             next()
//         }
//     }
// }