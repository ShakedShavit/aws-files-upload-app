const express = require('express');
const FileModel = require('../models/fileModel');
const User = require('../models/userModel');
const { uploadFileToS3, getFileFromS3, deleteFileFromS3 } = require('../middleware/s3-handlers');
const auth = require('../middleware/auth');
const { Readable } = require('stream');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('API is Working!');
    // try {
    //     // const user = await new User({
    //     //     username: "a",
    //     //     password: "bfj3290"
    //     // }).save()
    //     const user = await User.findOne();
    //     // console.log(user)
    //     await user.remove()

    //     // const file = await new FileModel({
    //     //     owner: user._id
    //     // }).save();
    //     // const files = await FileModel.find({owner: user._id});
    //     // console.log(files)
    // } catch (err) {
    //     res.status(400).send(err);
    // }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        const token = await user.generateAuthToken();

        res.status(200).send({ user, token });
    } catch (err) {
        res.status(400).send(err.message || err);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const user = new User({ ...req.body });
        await user.save();

        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (err) {
        if (err.code === 11000 && Object.keys(err.keyValue).includes('username')) {
            return res.status(409).send({
                status: 409,
                message: 'Username already taken'
            });
        }
        res.status(400).send(err);
    }
});

router.post('/upload-file', auth, uploadFileToS3, async (req, res) => {
    if (!req.file) {
        return res.status(422).send({
            status: 422,
            message: "file not uploaded"
        });
    }
    try {
        const file = new FileModel({
            originalName: req.file.originalname,
            storageName: req.file.key.split("/")[1],
            bucket: process.env.S3_BUCKET,
            region: process.env.AWS_REGION,
            key: req.file.key,
            type: req.file.mimetype,
            owner: req.user._id
        });

        await file.save();
        res.send(file);
    } catch(err) {
        res.status(400).send(err);
    }
});

router.get('/get-all-files', auth, async (req, res) => {
    try {
        const files = await FileModel.find({ owner: req.user._id });
        if (!files) {
            res.status(404).send({
                message: 'No file found'
            });
        }
        res.send(files);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/get-file', auth, getFileFromS3, async (req, res) => {
    try {
        const stream = Readable.from(req.fileBuffer);
        const fileName = req.query.name;

        if (req.query.download === 'true') {
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + fileName
            );
        } else {
            res.setHeader(
                'Content-Disposition',
                'inline'
            );
        }
        
        stream.pipe(res);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.delete('/delete-file', auth, deleteFileFromS3, async (req, res) => {
    try {
        await FileModel.findByIdAndDelete(req.body.id);
        res.send();
    } catch(err) {
        res.status(400).send();
    }
});

module.exports = router;