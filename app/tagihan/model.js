const mongoose = require('mongoose');

let tagihanSchema = new mongoose.Schema({
    idTagihan: {
        type: String,
        required: [
            true,
            "ID Tagihan harus diisi"
        ],
        unique: true,
    },
    idMeteran: {
        type: String,
        required: [
            true,
            "ID Meteran harus diisi"
        ]
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
            "Alamat Rumah harus diisi"
        ],
    },
    bulanTagihan: {
        type: String,
        enum: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        required: [
            true,
            "Bulan Tagihan harus diisi"
        ]
    },
    tahunTagihan: {
        type: String,
        required: [
            true,
            "Tahun Tagihan harus diisi"
        ],
    },
    meteranSebelumnya: {
        type: Number,
        required: [
            true,
            "Meteran sebelumnya harus diisi"
        ],
    },
    meteranSekarang: {
        type: Number,
        required: [
            true,
            "Meteran saat ini harus diisi"
        ],
    },
    totalTagihan: {
        type: String,
        required: [
            true,
            "Total tagihan harus diisi"
        ],
    },
    statusPembayaran: {
        type: String,
        enum: ['Lunas', 'Belum Lunas'],
        required: [
            true,
            "Status Pembayaran harus diisi"
        ],
    },
    tanggalBayar: {
        type: String
    },
    metodeBayar: {
        type: String,
        enum: ['-', 'Cash', 'Transfer', 'QRIS']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tagihan', tagihanSchema);