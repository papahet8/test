const cloudinary = require('cloudinary');
const assert  = require('assert');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const removeTempFiles = (path) => {
    fs.unlinkSync(path)
}

const imgCtrl = {
  uploadImg: async (req, res) => {
    try {
    //   res.json(req.files)
    if(!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({ msg: "no files to upload" })

    const file = req.files.myfile;

    // img size validation
    if(file.size > 10* 1024* 1024){
        removeTempFiles(file.tempFilePath);
        return res.status(400).json({ msg: "file size must be less than 10Mb" })
    }

    //file format validation
    if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
        removeTempFiles(file.tempFilePath);
        return res.status(400).json({ msg: "only .jpg and .png files" })
    }

    cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "product"}, async (err, result) => {
        if(err)
            assert.deepStrictEqual(err, null)
        removeTempFiles(file.tempFilePath)
        return res.status(200).json({
            public_id: result.public_id,
            url: result.secure_url
        })
    })


    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteImg: async (req, res) => {
    try {
    //   res.json({ msg: "delete img called" });

        const { public_id } = req.body;

        if(!public_id)
            return res.status(400).json({ msg: "no images selected"});

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if(err)
                assert.deepStrictEqual(err, null)
            res.status(200).json({msg: "image deleted successfully"})
        })
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = imgCtrl;
