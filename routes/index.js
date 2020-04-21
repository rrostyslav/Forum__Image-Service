const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const IndexControllers = require('../controllers/index');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        const error = new Error('Unsupported mimetype');
        error.status = 400;
        cb(error, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter
});

router.get('/:id', IndexControllers.getImage);

router.post('/', upload.single('image'), IndexControllers.uploadImage);

module.exports = router;