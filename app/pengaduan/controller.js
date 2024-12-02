const ObjectId = require('mongoose').Types.ObjectId

const pengaduanModel = require('./model')
const counterModel = require('../counter/model')

module.exports = {
    pengaduan: async (req, res) => {
        try {

            const pengaduan = await pengaduanModel.find()

            res.status(200).json({
                data: pengaduan
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    pengaduanByIdMeteran: async (req, res) => {
        try {

            const { idMeteran } = req.params

            const pengaduan = await pengaduanModel.find({
                idMeteran
            })

            res.status(200).json({
                data: pengaduan
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    createpengaduan: async (req, res) => {
        try {
            const { idMeteran, pesan } = req.body

            const counter = await counterModel.findOneAndUpdate(
                { _id: 'idPengaduanCounter' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true } // Create if not exists
            );

            // Generate ID meteran
            const idPengaduan = `PAM-ADUAN-${counter.seq}`;

            // Simpan data pengaduan
            const payload = {
                idPengaduan,
                idMeteran,
                pesan,
            };

            const pengaduan = new pengaduanModel(payload);
            await pengaduan.save()

            res.status(200).json({
                message: 'Berhasil menambahkan pengaduan!',
                data: payload
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    pengaduanById: async (req, res) => {
        try {
            const { idPengaduan } = req.params

            const pengaduan = await pengaduanModel.findOne({
                idPengaduan
            });

            res.status(200).json({
                data: pengaduan
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    updatepengaduanById: async (req, res) => {
        try {
            const { idPengaduan } = req.params
            const updatedData = req.body

            const pengaduan = await pengaduanModel.updateOne({
                idPengaduan
            }, {
                $set: updatedData
            });

            res.status(200).json({
                message: 'Berhasil mengubah data pengaduan!',
                data: pengaduan
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    deletepengaduanById: async (req, res) => {
        try {
            const { idPengaduan } = req.params

            await pengaduanModel.findOneAndDelete({
                idPengaduan
            });

            res.status(200).json({
                message: 'Berhasil menghapus data pengaduan!'
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
}