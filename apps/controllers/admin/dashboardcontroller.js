var express = require("express");
var router = express.Router();

// /admin

router.get("/", function(req, res){
    res.render("admin/dashboard");
})

router.use("/contest", require(__dirname + "/contestcontroller"));

module.exports = router;