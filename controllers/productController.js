const asyncHandler = require("../middleware/asyncHandle.middleware");
const { Product } = require("../models");
const { Category } = require("../models");
const { Op } = require("sequelize");

const addProduct = asyncHandler(async (req, res) => {
	let { name, description, price, categoryId, stock } = req.body;

	const file = req.file;

	if (!file) {
		res.status(400);
		throw new Error("Tidak Ada file Imange di Input");
	}

	const fileName = file.filename;
	const pathFile = `${req.protocol}://${req.get(
		"host"
	)}/public/uploads/${fileName}`;

	const newProduct = await Product.create({
		name,
		description,
		price,
		categoryId,
		stock,
		image: pathFile,
	});

	res.status(200).json({
		data: newProduct,
	});
});

const readProduct = asyncHandler(async (req, res) => {
	const { search, limit, page } = req.query;

	let productData = "";

	if (search || limit || page) {
		const pageData = page * 1 || 1;
		const limitData = limit * 1 || 100;
		const offset = (pageData - 1) * limitData;
		const searchingData = search || "";

		const products = await Product.findAndCountAll(
			{
				limit: limitData,
				offset: offset,
			},
			{
				where: {
					name: {
						[Op.like]: "%" + searchingData + "%",
					},
				},
				include: {
					model: Category,
					attributes: { exclude: ["createdAt", "updatedAt", "description"] },
				},
			}
		);
		productData = products;
	} else {
		const products = await Product.findAndCountAll({
			include: {
				model: Category,
				attributes: { exclude: ["createdAt", "updatedAt", "description"] },
			},
		});
		productData = products;
	}

	return res.status(200).json({
		data: productData,
	});
});

const detailProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const productData = await Product.findByPk(id, {
		include: {
			model: Category,
			attributes: { exclude: ["createdAt", "updatedAt", "description"] },
		},
	});

	if (!productData) {
		res.status(401);
		throw new Error("Product Tidak Ditemukan");
	}

	res.status(200).json({
		data: productData,
	});
});

const updateProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { name, description, price, stock, categoryId } = req.body;

	const productData = await Product.findByPk(id);

	if (!productData) {
		res.status(401);
		throw new Error("Product Tidak Ditemukan");
	}

	const file = req.file;

	if (file) {
		const nameImage = productData.image.replace(
			`${req.protocol}://${req.get("host")}/public/uploads/`,
			""
		);
		const filePath = `./public/uploads/${nameImage}`;

		fs.unlinkSync(filePath, (err) => {
			if (err) {
				res.status(400);
				throw new Error("File Tidak Ditemukan");
			}
		});

		const fileName = file.filename;
		const pathFile = `${req.protocol}://${req.get(
			"host"
		)}/public/uploads/${fileName}`;

		productData.image = pathFile;
	}

	productData.name = name || productData.name;
	productData.description = description || productData.description;
	productData.price = price || productData.price;
	productData.stock = stock || productData.stock;
	productData.categoryId = categoryId || productData.categoryId;

	productData.save();

	res.status(200).json({
		message: "Success Updated",
		data: productData,
	});
});

const deleteProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const productData = await Product.findByPk(id);
	if (productData) {
		const nameImage = productData.image.replace(
			`${req.protocol}://${req.get("host")}/public/uploads/`,
			""
		);
		const filePath = `./public/uploads/${nameImage}`;

		fs.unlinkSync(filePath, (err) => {
			if (err) {
				res.status(400);
				throw new Error("File Tidak Ditemukan");
			}
		});
	} else {
		res.status(404);
		throw new Error("Product Tidak Ditemukan");
	}

	productData.destroy();

	return res.status(200).json({
		message: "Date Berhasil Dihapus",
	});
});

module.exports = {
	addProduct,
	readProduct,
	detailProduct,
	updateProduct,
	deleteProduct,
};
