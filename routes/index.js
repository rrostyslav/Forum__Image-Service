const router = require('express').Router();
const { upload } = require('../config/multer')

router.get('/:id', async (req, res, next) => {
    const id = +req.params.id;
    if (isNaN(id)) {
        const error = new Error('Invalid image ID');
        error.status = 400;
        return next(error);
    }
    if(id === -1) return res.status(200).json({
        id: -1,
        uri: 'None'
    })
    try {
        const image = await req.con.execute("SELECT * FROM image WHERE id=?", [id]);
        if (image[0].length === 0) {
            const error = new Error('No such image');
            error.status = 400;
            return next(error);
        }
        res.status(200).json(image[0][0]);
    } catch (err) {
        console.log(err);
        next(new Error('Falied to get image'));
    }
});

router.post('/', upload.single('image'), async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: 'No image' });
    try {
        await req.con.execute("INSERT INTO image VALUES(null, ?)", [req.file.filename]);
        res.status(200).json({
            filename: req.file.filename
        });
    } catch (err) {
        console.log(err);
        next(new Error('Falied to add image'))
    }
});

module.exports = router;