var express = require("express");
const { ObjectId } = require("mongodb");

var router = express.Router();
var Product = require("../entity/product");
var ProductService = require("../services/productService");

const { verifyToken, verifyPermission, verifyRole } = require('../util/VerifyToken');

router.use("/1", function(req, res){
    res.render("product");
    // res.json({message: "This is product page"});
});

// router.get("/product-list", verifyToken, verifyRole("admin"), verifyPermission("product.view"), async function(req, res){
router.get("/product-list", verifyToken, async function(req, res){
    var productService = new ProductService();
    var product = await productService.getProductList();
    res.json(product);
});

router.post("/insert-product", verifyToken, async function(req, res){
    var productService = new ProductService();
    var pro = new Product();
    pro.Name = req.body.Name;
    pro.Price = req.body.Price;
    var result = await productService.insertProduct(pro);
    res.json({status: true, message: "Insert product successly"});
});

router.delete("/delete-product", async function(req, res){
    var productService = new ProductService();
    await productService.deleteProduct(req.query.id);
    res.json({status: true, message: "Delete product successly"});
});

router.post("/update-product", async function(req, res){
    var productService = new ProductService();
    var pro = new Product();
    pro._id = new ObjectId(req.body.Id);
    pro.Name = req.body.Name;
    pro.Price = req.body.Price;
    await productService.updateProduct(pro);
    res.json({status: true, message: "Update product succcessly"});
});

router.get("/get-product", async function(req, res){
    var productService = new ProductService();
    var product = await productService.getProduct(req.query.id);
    res.json(product);
});

module.exports = router;