const route = require("express").Router();
const imgCtrl = require("../controller/imgCtrl");
;

route.post(`/upload`, imgCtrl.uploadImg);
route.post(`/destroy`, imgCtrl.deleteImg);



module.exports = route;
