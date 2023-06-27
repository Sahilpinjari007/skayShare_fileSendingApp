const router = require('express').Router();
const File = require('../models/file');


router.get('/:uuid', async (req, resp) =>{

    const file = await File.findOne({ uuid: req.params.uuid });
    if(!file){
        return resp.render('downlaod', { error:'Link has been expired! '});
    }


    const filePath = `${__dirname}/../${file.path}`;
    resp.download(filePath);
})


module.exports = router;
