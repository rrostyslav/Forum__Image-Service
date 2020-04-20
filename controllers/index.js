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