const mongoose = require('mongoose');

let counterSchema = new mongoose.Schema({
    _id: { type: String, default: 'idMeteranCounter' },
    seq: { type: Number, default: 1000 }, // Mulai dari 1000 untuk mendapatkan format ID 'PAM-1000',
}, {
    _id: { type: String, default: 'idAuthCounter' },
    seq: { type: Number, default: 1000 }, // Mulai dari 1000 untuk mendapatkan format ID 'PAM-1000'
}, {
    _id: { type: String, default: 'idPengaduanCounter' },
    seq: { type: Number, default: 1000 } // Mulai dari 1000 untuk mendapatkan format ID 'PAM-1000'
});

let idPengaduanCounterSchema = new mongoose.Schema({
    _id: { type: String, default: 'idPengaduanCounter' },
    seq: { type: Number, default: 1000 } // Mulai dari 1000 untuk mendapatkan format ID 'PAM-1000'
});

let idAuthSchema = new mongoose.Schema({
    _id: { type: String, default: 'idAuthCounter' },
    seq: { type: Number, default: 1000 } // Mulai dari 1000 untuk mendapatkan format ID 'PAM-1000'
});

module.exports = mongoose.model('Counter', counterSchema);