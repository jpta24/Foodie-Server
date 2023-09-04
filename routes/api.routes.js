const router = require('express').Router();
const cloudinary = require('cloudinary').v2;

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

router.post(
	'/upload',
	fileUploader.single('imageUrl'),
	async (req, res, next) => {
		try {
			const { currentImg } = req.body;
			if (currentImg !== 'null') {
				const publicId =
					'foodie-gallery/' +
					currentImg.substring(
						currentImg.lastIndexOf('/') + 1,
						currentImg.lastIndexOf('.')
					);
				await cloudinary.uploader.destroy(publicId);
			}

			if (!req.file) {
				throw new Error('No file uploaded!');
			}

			res.json({ fileUrl: req.file.path });
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
