const mongoose = require('mongoose');

let ambangSchema = new mongoose.Schema({
    dusunRTRW: {
        type: String,
        required: [
            true,
            "Dusun dan RT RW harus diisi"
        ],
        unique: true,
    },
    ambangMinimum: {
        meteranUsaha: {
            type: Number,
            required: [
                true,
                "Ambang Minimum Meteran harus diisi"
            ],
            default: 0
        },
        meteranPribadi: {
            type: Number,
            required: [
                true,
                "Ambang Minimum Meteran harus diisi"
            ],
            default: 0
        }
    },
    nominalMinimum: {
        meteranUsaha: {
            type: Number,
            required: [
                true,
                "Nominal Minimum Meteran harus diisi"
            ],
            default: 0
        },
        meteranPribadi: {
            type: Number,
            required: [
                true,
                "Nominal Minimum Meteran harus diisi"
            ],
            default: 0
        }
    },
    hargaPerKubik: {
        meteranUsaha: {
            type: Number,
            required: [
                true,
                "Harga per kubik harus diisi"
            ],
            default: 0
        },
        meteranPribadi: {
            type: Number,
            required: [
                true,
                "Harga per kubik harus diisi"
            ],
            default: 0
        }
    },
    biayaAdmin: {
        meteranUsaha: {
            type: Number,
            required: [
                true,
                "Biaya admin harus diisi"
            ],
            default: 0
        },
        meteranPribadi: {
            type: Number,
            required: [
                true,
                "Biaya admin harus diisi"
            ],
            default: 0
        }
    },
    hargaPerKubik: {
        meteranUsaha: {
            type: Number,
            required: [
                true,
                "Harga per kubik harus diisi"
            ],
            default: 0
        },
        meteranPribadi: {
            type: Number,
            required: [
                true,
                "Harga per kubik harus diisi"
            ],
            default: 0
        }
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Ambang', ambangSchema);