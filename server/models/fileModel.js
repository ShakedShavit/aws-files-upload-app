const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    storageName: {
        type: String,
        required: true
    },
    bucket: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true
});

const FileModel = mongoose.model('FileModel', fileSchema);

module.exports = FileModel;