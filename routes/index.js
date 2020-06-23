'use strict';
const router = require('express').Router();

router.get('/:id', async (req, res, next) => {
  const id = +req.params.id;
  if (isNaN(id)) {
    const error = new Error('Invalid image ID');
    error.status = 400;
    return next(error);
  }
  if (id === -1) return res.status(200).json({
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
  req.con.end();
});

router.post('/', async (req, res, next) => {
  try {
    const filename = req.body.filename;
    await req.con.execute("INSERT INTO image VALUES(null, ?)", [filename]);
    res.status(200).json({
      filename: filename
    });
  } catch (err) {
    console.log(err);
    next(new Error('Falied to add image'))
  }
  req.con.end();
});

module.exports = router;