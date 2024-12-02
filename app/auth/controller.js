const akunModel = require('../akun/model')
const bcrypt = require('bcrypt')

module.exports = {
    actionSignIn: async (req, res) => {
        try {

            const { username, password } = req.body
            const check = await akunModel.findOne({
                username
            })

            if(check) {
                // Data found
                const checkPassword = await bcrypt.compare(password, check.password)

                if(checkPassword) {
                    // Password match
                    req.session.user = check

                    res.status(200).json({
                        message: check,
                        title: 'Berhasil login'
                    })
                } else {
                    // Password didn't match
                    res.status(500).json({
                        message: "Password tidak cocok",
                        title: 'Terjadi kesalahan'
                    })
                }
            } else {
                // Data not found
                res.status(500).json({
                    message: "Akun tidak ditemukan",
                    title: 'Terjadi kesalahan'
                })
            }

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    actionLogout: async (req, res) => {
        req.session.destroy()
        res.status(200).json({
            message: req.session,
            title: 'Berhasil logout'
        })
    },

}