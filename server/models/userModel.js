const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const FileModel = require('./fileModel');
const { deleteFileFromS3Util } = require('../middleware/s3-handlers');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

userSchema.virtual('files', {
    ref: 'FileModel',
    localField: '_id',
    foreignField: 'owner'
});

// Hiding info
userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;

    return userObj;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign(
        {
            _id: user._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h"
        }
    );

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.statics.findByCredentials = async (username, password) => {  
    let loginCredentialsErrorMsg = 'Username and/or password are incorrect';

    let user = await User.findOne({ username });
    if (!user) throw new Error(loginCredentialsErrorMsg);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error(loginCredentialsErrorMsg);
    }

    return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Delete user files when user is deleted
userSchema.pre('remove', async function(next) {
    const user = this;
    try {
        await user.populate('files').execPopulate();
        for (file of user.files) {
            await deleteFileFromS3Util(file.key);
        }

        await FileModel.deleteMany({ owner: user._id });

        next();
    } catch (err) {
        res.status(400).send({
            message: 'Failed to delete files in bucket',
            err
        });
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;