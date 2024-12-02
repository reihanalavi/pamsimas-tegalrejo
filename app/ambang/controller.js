const ObjectId = require('mongoose').Types.ObjectId

const ambangModel = require('./model')
const pelangganModel = require('../pelanggan/model')

module.exports = {
    ambang: async (req, res) => {
        try {

            const { dusunRTRW } = req.query

            if(dusunRTRW) {
                let ambang = await ambangModel.findOne({
                    dusunRTRW
                })
    
                res.status(200).json({
                    data: ambang
                })
            } else {
                const ambang = await ambangModel.find()

                res.status(200).json({
                    data: ambang
                })
            }

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    createAmbang: async (req, res) => {
        try {
            const { dusuns } = req.body

            for(const dusun of dusuns) {
                const ambang = new ambangModel({
                    dusunRTRW: dusun.dusunRTRW,
                    ambangMinimum: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                    nominalMinimum: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                    hargaPerKubik: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                    biayaAdmin: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                })

                await ambang.save()
            }

            res.status(200).json({
                message: 'Berhasil menambahkan ambang!',
                data: dusuns
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    generateAmbang: async (req, res) => {
        try {

            // Get Dusun per RT RW
            let pelangganPerRTRW = await pelangganModel.aggregate([
                {
                    $group: {
                        _id: "$alamatRumah"
                    }
                }
            ])

            for(const dusun of pelangganPerRTRW) {
                const ambang = new ambangModel({
                    dusunRTRW: dusun._id,
                    ambangMinimum: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                    nominalMinimum: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                    hargaPerKubik: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                    biayaAdmin: {
                        meteranUsaha: 0,
                        meteranPribadi: 0
                    },
                })

                await ambang.save()
            }
            
            res.status(200).json({
                message: 'Berhasil menambahkan ambang!',
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    
    updateAmbangById: async (req, res) => {
        try {
            const { dusunRTRW } = req.params
            const updatedData = req.body

            const ambang = await ambangModel.updateOne({
                dusunRTRW
            }, {
                $set: updatedData
            });

            res.status(200).json({
                message: 'Berhasil mengubah data ambang!',
                data: ambang
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    updateAllAmbang: async (req, res) => {
        try {
            const updatedData = req.body
            
            const ambang = await ambangModel.find()

            let updated = []
            ambang.forEach(ambang => {
                console.log(ambang)
                console.log(`AMBANG: ${ambang.dusunRTRW}`)
                console.log(updatedData)
                
                const dusunRTRW = ambang.dusunRTRW

                const item = ambangModel.updateOne({
                    dusunRTRW
                }, {
                    $set: updatedData
                }).exec();

                updated.push(updatedData)
            });

            res.status(200).json({
                message: 'Berhasil mengubah data semua ambang!',
                data: updated
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    deleteAmbangById: async (req, res) => {
        try {
            const { dusunRTRW } = req.params

            await ambangModel.findOneAndDelete({
                dusunRTRW
            });

            res.status(200).json({
                message: 'Berhasil menghapus data ambang!'
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
}