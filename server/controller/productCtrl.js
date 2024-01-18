const Product = require("../model/productModel");

const productCtrl = {
  /* getProducts: async (req, res) => {
    try {
      // res.json({ msg: "get product" });
      const products = await Product.find();
        res.json({
          length: products.length,
          products
        })
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }, */
  
  getProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // default to page 1
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; // default to 10 items per page
  
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / itemsPerPage);
  
      const products = await Product.find()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
  
      res.json({
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
        products: products
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  
  createProducts: async (req, res) => {
    try {
      // res.json({ msg: "create product" });
      const { product_id, name, price, taluka, images, place, jhilla, qnty, product_name, contact_no } =
        req.body;

      if (!images) return res.status(400).json({ msg: "no image found" });

      const product = await Product.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: "products already exist" });

      const newProduct = new Product({
        product_id,
        name: name.toLowerCase(),
        price,
        taluka,
        images,
        place,
        jhilla,
        qnty,
        product_name,
        contact_no
      });

      await newProduct.save()
      res.json({ msg: "product created successfully"})

      
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProducts: async (req, res) => {
    try {
      //res.json({ msg: "update product" });

      const { product_id, name, price, taluka, images, place, jhilla, qnty, product_name, contact_no } = req.body;
      const id = req.params.id;

      if (!images)
        return res.status(400).json({msg: "no image found"});

      await Product.findOneAndUpdate({ _id: id}, {
        product_id,
        name: name.toLowerCase(),
        price,
        taluka,
        images,
        place,
        jhilla,
        qnty,
        product_name,
        contact_no
      });

        return res.status(200).json({ msg: "product updated successfully"})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      //res.json({ msg: "delete product" });
      const id = req.params.id;
      await Product.findByIdAndDelete({ _id: id});
        return res.status(200).json({ msg: "product deleted successfully"});
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
