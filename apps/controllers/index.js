var express = require("express");
var router = express.Router();

// router.get("/", function (req, res) {
//     res.json({ "message": "This is index page" });
// });

router.use("/", require(__dirname + "/homecontroller"));

router.use("/product", require(__dirname + "/productcontroller"));

router.use("/admin", require(__dirname + "/admin/dashboardcontroller"));

router.use("/authenticate", require(__dirname + "/api/authenticatecontroller"));

module.exports = router;