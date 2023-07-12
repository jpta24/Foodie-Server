const router = require('express').Router();
const cloudinary = require('cloudinary').v2;

const Business = require('../models/Bussiness.model');
const Product = require('../models/Product.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');

router.post('/', isAuthenticated, (req, res, next) => {
	const {
		name,
		mainImg,
		description,
		business,
		type,
		weight,
		price,
		ingredients,
		categories,
		status,
	} = req.body;

	if (name === '') {
		res
			.status(400)
			.json({ message: 'Please provide a Name for your Product ' });
		return;
	}

	Product.create({
		name,
		mainImg,
		description,
		business,
		type,
		weight,
		price,
		ingredients,
		categories,
		status,
	})
		.then((product) => {
			return Business.findByIdAndUpdate(
				business,
				{ $push: { products: product._id } },
				{ new: true }
			);
		})
		.then((business) => {
			res.status(200).json(business);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Could not create the Business, check data and try again',
			});
		});
});

router.put('/status/:productID', isAuthenticated, (req, res, next) => {
	const productID = req.params.productID;

	const { status } = req.body;
	Product.findByIdAndUpdate(productID, { status }, { new: true })
		.then((product) => {
			res.status(200).json(product);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/edit/:productID', isAuthenticated, (req, res, next) => {
	const productID = req.params.productID;

	const {
		name,
		mainImg,
		description,
		type,
		weight,
		price,
		ingredients,
		categories,
		status,
	} = req.body;
	Product.findByIdAndUpdate(
		productID,
		{
			name,
			mainImg,
			description,
			type,
			weight,
			price,
			ingredients,
			categories,
			status,
		},
		{ new: true }
	)
		.then((product) => {
			res.status(200).json(product);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/:productID', (req, res, next) => {
	const productID = req.params.productID;

	Product.findById(productID)
		.populate('business')
		.populate({
			path: 'business',
			populate: {
				path: 'products'
			},
		})
		.then((product) => {
			if (product) {
				res.status(200).json({ product });
			} else {
				res.status(400).json({ message: 'Product does not exists.' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.delete('/delete/:productID', isAuthenticated, async (req, res, next) => {
	try {
		const { productID } = req.params;
		// Elimina el producto de la base de datos
		const product = await Product.findByIdAndDelete(productID);
		// Verifica si la eliminación fue exitosa y si existe una imagen principal
		if (product && product.mainImg) {
			// Extrae el public_id de la imagen principal del producto
			const publicId =
				'foodie-gallery/' +
				product.mainImg.substring(
					product.mainImg.lastIndexOf('/') + 1,
					product.mainImg.lastIndexOf('.')
				);

			// Borra la imagen de Cloudinary
			const result = await cloudinary.uploader.destroy(publicId);

			// Verifica si la eliminación de la imagen fue exitosa
			if (result.result === 'ok') {
				return res.status(200).json({
					message:
						'Product was successfully deleted and the image from Cloudinary was removed ',
				});
			} else {
				return res
					.status(500)
					.json({ message: 'Error removing the Image from Cloudinary' });
			}
		}

		return res
			.status(200)
			.json({ message: 'Product was successfully deleted' });
	} catch (error) {
		next(error);
	}
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;
