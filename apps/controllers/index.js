var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("home");
});

router.use("/home", require(__dirname + "/homecontroller"));

router.use("/product", require(__dirname + "/productcontroller"));

router.use("/user", require(__dirname + "/usercontroller"));

router.use("/admin", require(__dirname + "/admin/dashboardcontroller"));

router.use("/authenticate", require(__dirname + "/api/authenticatecontroller"));

module.exports = router;