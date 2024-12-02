const mongoose = require('mongoose');

let pelangganSchema = new mongoose.Schema({
    idMeteran: {
        type: String,
        required: [
            true,
            "ID Meteran harus diisi"
        ],
        unique: true,
    },
    namaKepalaRumah: {
        type: String,
        required: [
            true,
            "Nama Kepala Rumah harus diisi"
        ]
    },
    alamatRumah: {
        type: String,
        required: [
            true,
            "Alamat rumah harus diisi"
        ]
    },
    statusMeteran: {
        type: String,
        enum: ['Aktif', 'Tidak Aktif'],
        required: [
            true,
            "Status harus diisi"
        ]
    },
    jenisMeteran: {
        type: String,
        enum: ['Pribadi', 'Usaha'],
        required: [
            true,
            "Jenis meteran harus diisi"
        ],
        default: 'Pribadi'
    },
    base64QR: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pelanggan', pelangganSchema);