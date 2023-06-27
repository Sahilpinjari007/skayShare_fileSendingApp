const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random(Math.random() * 1E9)} ${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})


let upload = multer({
    storage,
    limit: { fileSize: 1000000 * 200 }

}).single('myfile');


router.post('/', (req, resp) => {

    // Store file
    upload(req, resp, async (err) => {

        // Validate request
        if (!req.file) {
            return resp.json({ error: 'All fields are required!' });
        }

        if (err) {
            return resp.status(500).send({ error: err.message });
        }

        // Store into Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });

        const response = await file.save();
        return resp.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })

    });

});






module.exports = router;