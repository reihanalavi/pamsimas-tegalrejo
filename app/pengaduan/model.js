const mongoose = require('mongoose');

let pengaduanSchema = new mongoose.Schema({
    idPengaduan: {
        type: String,
        required: [
            true,
            "ID Pengaduan harus diisi"
        ],
        unique: true,
    },
    idMeteran: {
        type: String,
        required: [
            true,
            "ID Meteran harus diisi"
        ],
    },
    pesan: {
        type: String,
        required: [
            true,
            "Pesan pengaduan harus diisi"
        ]
    },
    statusAduan: {
        type: String,
        enum: ['Belum diproses', 'Diproses', 'Selesai'],
        required: [
            true,
            "Status aduan harus diisi"
        ],
        default: 'Belum diproses'
    },
    pjAduan: {
        type: String,
        required: [
            true,
            "Penanggung Jawab aduan harus diisi"
        ],
        default: '-'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pengaduan', pengaduanSchema);