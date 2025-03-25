var express = require("express");
const { ObjectId } = require("mongodb");

var router = express.Router();
var User = require('../entity/user');
var UserService = require('../services/userService');

// const { verifyToken, verifyPermission, verifyRole } = require('../util/VerifyToken');

// router.use("/", function(req, res){
//     res.json({message: "This is user page"});
// });

router.post("/insert-user", async function(req, res){
    var userService = new UserService();
    var user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = req.body.role;

    var result = await userService.insertUser(user);
    res.json({status: true,  message: "Insert user successly"});
});

router.post("/update-user", async function(req, res){
    var userService = new UserService();
    var user = new User();

    user._id = new ObjectId(req.body.Id);
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = req.body.role;
    await userService.updateUser(user);
    res.json({status: true, message: "Update user succcessly"});
});

router.get("/get-user-by-username", async function(req, res){
    var userService = new UserService();
    var user = await userService.getUserByUsername(req.query.username);
    res.json(user);
});

router.get("/get-user-by-email", async function(req, res){
    var userService = new UserService();
    var user = await userService.getUserByEmail(req.query.email);
    res.json(user);
});
module.exports = router;
