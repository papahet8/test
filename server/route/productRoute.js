const route = require("express").Router();
const productCtrl = require("../controller/productCtrl");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

route.get(`/products`, productCtrl.getProducts);
route.post(`/products`, auth, adminAuth, productCtrl.createProducts);
route.put(`/products/:id`, auth, adminAuth, productCtrl.updateProducts);
route.delete(`/products/:id`, auth, adminAuth, productCtrl.deleteProducts);

module.exports = route;
