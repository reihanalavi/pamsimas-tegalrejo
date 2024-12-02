const tagihanModel = require('../tagihan/model')
const pengaduanModel = require('../pengaduan/model')
const pelangganModel = require('../pelanggan/model')

module.exports = {
    dashboard: async (req, res) => {
        try {

            // Get pemasukan bulan ini
            const currentDate = new Date()
            const currentMonth = currentDate.getMonth() + 1
            const currentYear = currentDate.getFullYear()

            let pemasukanBulanIni = await tagihanModel.aggregate([
                {
                    $match: {
                        bulanTagihan: currentMonth,
                        tahunTagihan: currentYear
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalTagihan: {
                            $sum: {
                                $toInt: "$totalTagihan"
                            }
                        },
                        jumlahTagihan: {
                            $sum: 1
                        }
                    }
                }
            ])

            if(!pemasukanBulanIni || pemasukanBulanIni.length === 0) {
                pemasukanBulanIni = {
                    "totalTagihan": 0,
                    "jumlahTagihan": 0
                }
            }

            // Get pemasukan tiap bulan
            let pemasukanPerBulan = await tagihanModel.aggregate([
                {
                    $group: {
                        _id: {
                            $concat: ["$tahunTagihan", "-", "$bulanTagihan"]
                        },
                        totalTagihan: {
                            $sum: {
                                $toInt: "$totalTagihan"
                            }
                        },
                        jumlahTagihan: {
                            $sum: 1
                        }
                    }
                }
            ])

            // Get jumlah pengaduan tiap bulan
            let pengaduanPerBulan = await pengaduanModel.aggregate([
                {
                    $project: {
                        yearMonth: {
                            $concat: [
                                { $arrayElemAt: [{ $split: [{ $toString: "$createdAt" }, "-"] }, 0] },
                                "-",
                                { $arrayElemAt: [{ $split: [{ $toString: "$createdAt" }, "-"] }, 1] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$yearMonth",
                        jumlahAduan: {
                            $sum: 1
                        }
                    }
                }
            ])

            if(!pengaduanPerBulan || pengaduanPerBulan.length === 0) {
                pengaduanPerBulan = "0"
            }

            // Get Pelanggan per RT RW
            let pelangganPerRTRW = await pelangganModel.aggregate([
                {
                    $group: {
                        _id: "$alamatRumah",
                        jumlahPelanggan: {
                            $sum: 1
                        }
                    }
                }
            ])

            if(!pelangganPerRTRW || pelangganPerRTRW.length === 0) {
                pelangganPerRTRW = "0"
            }

            res.status(200).json({
                title: 'Berhasil mendapatkan data dashboard!',
                pemasukanPerBulan,
                pemasukanBulanIni,
                pengaduanPerBulan,
                pelangganPerRTRW
            })
            
        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    getPemasukanCustom: async (req, res) => {
        try {

            const { bulanTagihan, tahunTagihan } = req.params

            let pemasukanBulanIni = await tagihanModel.aggregate([
                {
                    $match: {
                        bulanTagihan,
                        tahunTagihan
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalTagihan: {
                            $sum: {
                                $toInt: "$totalTagihan"
                            }
                        },
                        jumlahTagihan: {
                            $sum: 1
                        }
                    }
                }
            ])

            res.status(200).json({
                title: 'Berhasil mendapatkan total tagihan!',
                totalTagihan: pemasukanBulanIni[0] ? pemasukanBulanIni[0] : "0",
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    }
}