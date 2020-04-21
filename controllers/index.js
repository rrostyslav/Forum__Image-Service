exports.uploadImage = async (req, res, next) => {
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
};

exports.getImage = async (req, res, next) => {
    const id = +req.params.id;
    if (isNaN(id) || id < 0) {
        const error = new Error('Invalid image ID');
        error.status = 400;
        return next(error);
    }
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
}