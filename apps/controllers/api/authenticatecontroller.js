var express = require("express");
var router = express.Router();

var UserService = require("../../services/userService");
var User = require("../../entity/user");

const jsonwebtoken = require("jsonwebtoken");
const jwtExpirySecond = 3000;

var config = require('../../../config/setting.json');

var { verifyToken } = require('../../util/VerifyToken');

router.get("/login", (req, res) => {
    res.render("authenticate/login", { errorMessage: null });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`${email} is trying to login ..`);

    if (!email || !password) {
        return res.status(401)
            .json({ message: "Vui lòng nhập email và password!" });
    }

    // Thực hiện kiểm tra thông tin đăng nhập
    var userService = new UserService();
    var user = new User();
    user = await userService.getUserByEmail(email);

    // Nếu user không tồn tại hoặc sai pass
    if (!user || user.password !== password) {
        return res.status(401)
            .json({ message: "Email và password không hợp lệ!" });
    }

    // Nếu user tồn tại
    var authorities = [];
    authorities.push(user.role);

    var claims = [];
    return res.json({
        token: jsonwebtoken.sign({ user: user.username, roles: authorities, claims: claims }, config.jwt.secret, { expiresIn: jwtExpirySecond }),
    });
});

router.get("/test-security", verifyToken, (req, res) => {
    console.log(req.userData);
    res.json({ "status": true, "message": "Login success" });
});

module.exports = router;