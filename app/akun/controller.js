const ObjectId = require('mongoose').Types.ObjectId
const HASH_ROUND = 10
const bcrypt = require('bcrypt')
const akunModel = require('./model')
const counterModel = require('../counter/model')

module.exports = {
    akun: async (req, res) => {
        try {

            const akun = await akunModel.find()

            res.status(200).json({
                data: akun
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    createakun: async (req, res) => {
        try {
            const { nama, username, password, permissions } = req.body

            const counter = await counterModel.findOneAndUpdate(
                { _id: 'idAkunCounter' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true } // Create if not exists
            );

            // Generate ID meteran
            const idAkun = `PAM-AUTH-${counter.seq}`;

            // Simpan data akun
            const payload = {
                idAkun,
                username,
                nama,
                password,
                permissions
            };

            const akun = new akunModel(payload);
            await akun.save()

            res.status(200).json({
                message: 'Berhasil menambahkan akun!',
                data: payload
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    akunById: async (req, res) => {
        try {
            const { username } = req.params

            const akun = await akunModel.findOne({
                username
            });

            res.status(200).json({
                data: akun
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    updateakunById: async (req, res) => {
        try {
            const { username } = req.params
            const updatedData = req.body

            if(updatedData.password) {
                hashed = await bcrypt.hashSync(updatedData.password, HASH_ROUND)
                updatedData.password = hashed
            }

            const akun = await akunModel.updateOne({
                username
            }, {
                $set: updatedData
            });

            res.status(200).json({
                message: 'Berhasil mengubah data akun!',
                data: akun
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    deleteakunById: async (req, res) => {
        try {
            const { username } = req.params

            await akunModel.findOneAndDelete({
                username
            });

            res.status(200).json({
                message: 'Berhasil menghapus data akun!'
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
}