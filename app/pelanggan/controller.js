const ObjectId = require('mongoose').Types.ObjectId

const pelangganModel = require('../pelanggan/model')
const counterModel = require('../counter/model')

const qrcode = require('qrcode');
const fs = require('fs')
const path = require('path');
const sharp = require('sharp');
const exceljs = require('exceljs')

module.exports = {
    generateExcelPelanggan: async (req, res) => {
        try {

            const { alamatRumah } = req.query

            if(alamatRumah) {
                const pelanggan = await pelangganModel.find({
                    alamatRumah
                })
                
                // init the excel
                const workbook = new exceljs.Workbook()
                const worksheet = workbook.addWorksheet('Data Pelanggan')

                // add the data
                worksheet.addRow(['ID Meteran', 'Alamat Rumah', 'Nama Pelanggan', 'Jenis Meteran', 'Status Meteran'])
                pelanggan.forEach(pelanggan => {
                    worksheet.addRow([pelanggan.idMeteran, pelanggan.alamatRumah, pelanggan.namaKepalaRumah, pelanggan.jenisMeteran, pelanggan.statusMeteran])
                });

                // convert as file
                const buffer = await workbook.xlsx.writeBuffer()

                // convert to base64
                const base64 = buffer.toString('base64')

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition',   
                `attachment; filename="pelanggan_${alamatRumah}.xlsx`);

                res.status(200).send(buffer)   
            } else {
                res.status(500).json({
                    message: 'Pilih Alamat Rumah terlebih dahulu',
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
    pelanggan: async (req, res) => {
        try {

            const { alamatRumah } = req.query

            if(alamatRumah) {
                const pelanggan = await pelangganModel.find({
                    alamatRumah
                })
                res.status(200).json({
                    data: pelanggan
                })   
            } else {
                const pelanggan = await pelangganModel.find()    
                res.status(200).json({
                    data: pelanggan
                })
            }

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    getPelangganByRTRW: async (req, res) => {
        try {

            let pelangganPerRTRW = await pelangganModel.aggregate([
                {
                    $group: {
                        _id: "$alamatRumah"
                    }
                }
            ])

            if(!pelangganPerRTRW || pelangganPerRTRW.length === 0) {
                pelangganPerRTRW = "0"
            }

            res.status(200).json({
                data: pelangganPerRTRW
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    createPelanggan: async (req, res) => {
        try {
            const { namaKepalaRumah, alamatRumah, statusMeteran, jenisMeteran } = req.body

            const counter = await counterModel.findOneAndUpdate(
                { _id: 'idMeteranCounter' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true } // Create if not exists
            );

            // Generate ID meteran
            const idMeteran = `PAM-${counter.seq}`;

            // Generate QR Pelanggan
            // Generate QR
            const qrCodePath = path.join(__dirname, '../../public/qr', `${idMeteran}.png`);
            const fullTemplatePath = path.join(__dirname, '../../public', 'template.png');

            const buffer = await qrcode.toBuffer(idMeteran, {
                errorCorrectionLevel: 'L',
                version: 1,
                margin: 0,
                width: 330,
                height: 330
            })

            const resized = await sharp(buffer)
            .resize({
                width: 330, height: 330
            })
            .toBuffer()

            const template = await sharp(fullTemplatePath).toBuffer()
            
            const numberMatch = idMeteran.match(/\d+/)
            const numberString = numberMatch[0]
            const digits = numberString.split('').map(Number)

            const digit1 = await sharp(path.join(__dirname, '../../public', `kode-${digits[0]}.png`)).toBuffer()
            const digit2 = await sharp(path.join(__dirname, '../../public', `kode-${digits[1]}.png`)).toBuffer()
            const digit3 = await sharp(path.join(__dirname, '../../public', `kode-${digits[2]}.png`)).toBuffer()
            const digit4 = await sharp(path.join(__dirname, '../../public', `kode-${digits[3]}.png`)).toBuffer()

            const imageWithQR = await sharp(template)
            .composite([
                {
                    input: resized,
                    gravity: 'center'
                },
                {
                    input: digit1,
                    top: 520,
                    left: 290
                },
                {
                    input: digit2,
                    top: 520,
                    left: 321
                },
                {
                    input: digit3,
                    top: 520,
                    left: 352
                },
                {
                    input: digit4,
                    top: 520,
                    left: 383
                },
            ]).toBuffer()
            const base64image = imageWithQR.toString('base64')

            // Simpan data pelanggan
            const payload = {
                namaKepalaRumah,
                alamatRumah,
                statusMeteran,
                jenisMeteran,
                idMeteran,
                base64QR: base64image
            };

            const pelanggan = new pelangganModel(payload);
            await pelanggan.save()

            res.status(200).json({
                message: 'Berhasil menambahkan pelanggan!',
                data: payload
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    createPelanggans: async (req, res) => {
        try {
            const { data } = req.body

            if(!data || data.length === 0) {
                res.status(500).json({
                    message: "Tidak ada data",
                    title: 'Terjadi kesalahan'
                })
            } else {
                const createdPelanggan = []

                for(const pelanggan of data) {
                    const counter = await counterModel.findOneAndUpdate(
                        { _id: 'idMeteranCounter' },
                        { $inc: { seq: 1 } },
                        { new: true, upsert: true } // Create if not exists
                    );
        
                    // Generate ID meteran
                    const idMeteran = `PAM-${counter.seq}`;

                    // Generate QR
                    const qrCodePath = path.join(__dirname, '../../public/qr', `${idMeteran}.png`);
                    const fullTemplatePath = path.join(__dirname, '../../public', 'template.png');

                    const buffer = await qrcode.toBuffer(idMeteran, {
                        errorCorrectionLevel: 'L',
                        version: 1,
                        margin: 0,
                        width: 330,
                        height: 330
                    })
        
                    const resized = await sharp(buffer)
                    .resize({
                        width: 330, height: 330
                    })
                    .toBuffer()

                    const template = await sharp(fullTemplatePath).toBuffer()
                    
                    const numberMatch = idMeteran.match(/\d+/)
                    const numberString = numberMatch[0]
                    const digits = numberString.split('').map(Number)

                    const digit1 = await sharp(path.join(__dirname, '../../public', `kode-${digits[0]}.png`)).toBuffer()
                    const digit2 = await sharp(path.join(__dirname, '../../public', `kode-${digits[1]}.png`)).toBuffer()
                    const digit3 = await sharp(path.join(__dirname, '../../public', `kode-${digits[2]}.png`)).toBuffer()
                    const digit4 = await sharp(path.join(__dirname, '../../public', `kode-${digits[3]}.png`)).toBuffer()

                    const imageWithQR = await sharp(template)
                    .composite([
                        {
                            input: resized,
                            gravity: 'center'
                        },
                        {
                            input: digit1,
                            top: 520,
                            left: 290
                        },
                        {
                            input: digit2,
                            top: 520,
                            left: 321
                        },
                        {
                            input: digit3,
                            top: 520,
                            left: 352
                        },
                        {
                            input: digit4,
                            top: 520,
                            left: 383
                        },
                    ]).toBuffer()
                    const base64image = imageWithQR.toString('base64')
        
                    // Simpan data pelanggan
                    const payload = {
                        namaKepalaRumah: pelanggan.namaKepalaRumah,
                        alamatRumah: pelanggan.alamatRumah,
                        statusMeteran: pelanggan.statusMeteran,
                        idMeteran,
                        jenisMeteran: pelanggan.jenisMeteran,
                        base64QR: base64image
                    };
        
                    const newPelanggan = new pelangganModel(payload);
                    await newPelanggan.save()
                    
                    createdPelanggan.push(newPelanggan)
                }
                res.status(200).json({
                    message: 'Berhasil menambahkan banyak pelanggan!',
                    data: createdPelanggan
                })
            }

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    pelangganById: async (req, res) => {
        try {
            const { idMeteran } = req.params

            const pelanggan = await pelangganModel.findOne({
                idMeteran: idMeteran
            });

            res.status(200).json({
                data: pelanggan
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    updatePelangganById: async (req, res) => {
        try {
            const { idMeteran } = req.params
            const updatedData = req.body

            const pelanggan = await pelangganModel.updateOne({
                idMeteran: idMeteran
            }, {
                $set: updatedData
            });

            res.status(200).json({
                message: 'Berhasil mengubah data pelanggan!',
                data: pelanggan
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    deletePelangganById: async (req, res) => {
        try {
            const { idMeteran } = req.params

            await pelangganModel.findOneAndDelete({
                idMeteran: idMeteran
            });

            res.status(200).json({
                message: 'Berhasil menghapus data pelanggan!'
            })

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
    generateQRbyId: async (req, res) => {
        try {
            const { idMeteran } = req.params
            const qrCodePath = path.join(__dirname, '../../public/qr', `${idMeteran}.png`);
            const fullTemplatePath = path.join(__dirname, '../../public', 'template.png');

            if(fs.existsSync(qrCodePath)) {
                res.status(200).json({
                    message: 'QR Code sudah ditemukan',
                    image: `qr/${idMeteran}.png`
                })
            } else {
                try {
                    const buffer = await qrcode.toBuffer(idMeteran, {
                        errorCorrectionLevel: 'L',
                        version: 1,
                        margin: 0,
                        width: 330,
                        height: 330
                    })
        
                    const resized = await sharp(buffer)
                    .resize({
                        width: 330, height: 330
                    })
                    .toBuffer()

                    const template = await sharp(fullTemplatePath).toBuffer()
                    
                    const numberMatch = idMeteran.match(/\d+/)
                    const numberString = numberMatch[0]
                    const digits = numberString.split('').map(Number)

                    const digit1 = await sharp(path.join(__dirname, '../../public', `kode-${digits[0]}.png`)).toBuffer()
                    const digit2 = await sharp(path.join(__dirname, '../../public', `kode-${digits[1]}.png`)).toBuffer()
                    const digit3 = await sharp(path.join(__dirname, '../../public', `kode-${digits[2]}.png`)).toBuffer()
                    const digit4 = await sharp(path.join(__dirname, '../../public', `kode-${digits[3]}.png`)).toBuffer()

                    const imageWithQR = await sharp(template)
                    .composite([
                        {
                            input: resized,
                            gravity: 'center'
                        },
                        {
                            input: digit1,
                            top: 520,
                            left: 290
                        },
                        {
                            input: digit2,
                            top: 520,
                            left: 321
                        },
                        {
                            input: digit3,
                            top: 520,
                            left: 352
                        },
                        {
                            input: digit4,
                            top: 520,
                            left: 383
                        },
                    ]).toBuffer()
                    const base64image = imageWithQR.toString('base64')

                    // fs.writeFileSync(`${idMeteran}.png`, buffer)
                    res.status(200).json({
                        message: 'Berhasil generate QR Code Pelanggan!',
                        image: base64image
                    })
                } catch (error) {
                    console.error('Error generating QR code:', error);
                }
            }

        } catch (error) {
            res.status(500).json({
                message: error.message,
                title: 'Terjadi kesalahan'
            })
        }
    },
}