const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const HASH_ROUND = 10

let akunSchema = new mongoose.Schema({
    idAkun: {
        type: String,
        required: [
            true,
            "ID Akun harus diisi"
        ],
        unique: true,
    },
    username: {
        type: String,
        required: [
            true,
            "Username akun harus diisi"
        ],
        unique: true,
    },
    nama: {
        type: String,
        required: [
            true,
            "Nama akun harus diisi"
        ],
        unique: true,
    },
    password: {
        type: String,
        require: [
            true,
            'Password harus diisi'
        ],
        maxLength: [
            225,
            'Panjang maks 225 karakter'
        ]
    },
    permissions: {
        // 01 - Super Admin     CREATE, READ,   UPDATE, DELETE
        // 02 - Pengelola               READ,   UPDATE, DELETE
        // 03 - Warga                   READ

        // 0    =   FALSE
        // 1    =   TRUE

        pelanggan: {
            create: {
                type: Number,
                required: true,
                default: 0
            },
            read: {
                type: Number,
                required: true,
                default: 0
            },
            update: {
                type: Number,
                required: true,
                default: 0
            },
            delete: {
                type: Number,
                required: true,
                default: 0
            },
        },
        tagihan: {
            create: {
                type: Number,
                required: true,
                default: 0
            },
            read: {
                type: Number,
                required: true,
                default: 0
            },
            update: {
                type: Number,
                required: true,
                default: 0
            },
            delete: {
                type: Number,
                required: true,
                default: 0
            },
        },
        pengaduan: {
            create: {
                type: Number,
                required: true,
                default: 0
            },
            read: {
                type: Number,
                required: true,
                default: 0
            },
            update: {
                type: Number,
                required: true,
                default: 0
            },
            delete: {
                type: Number,
                required: true,
                default: 0
            },
        },
        ambang: {
            create: {
                type: Number,
                required: true,
                default: 0
            },
            read: {
                type: Number,
                required: true,
                default: 0
            },
            update: {
                type: Number,
                required: true,
                default: 0
            },
            delete: {
                type: Number,
                required: true,
                default: 0
            },
        },
        akun: {
            create: {
                type: Number,
                required: true,
                default: 0
            },
            read: {
                type: Number,
                required: true,
                default: 0
            },
            update: {
                type: Number,
                required: true,
                default: 0
            },
            delete: {
                type: Number,
                required: true,
                default: 0
            },
        },
    },
}, {
    timestamps: true
});

akunSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('Akun', akunSchema);