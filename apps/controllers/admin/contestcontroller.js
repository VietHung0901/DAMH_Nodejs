var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");

var route = express.Router();
var Contest = require("../../entity/contest");
var ContestService = require("../../services/contestService");

const { verifyToken, verifyRole } = require('../../util/VerifyToken');

router.use("/registration", require(__dirname + "/registrationcontroller"));

router.use("/resultsheet", require(__dirname + "/resultsheetcontroller"));

router.get("/", function(req, res){
    res.render("admin/contest/list");
})

router.get("/insert", function(req, res){
    res.render("admin/contest/insert");
})

router.post("/insert-contest", async function(req, res){
    var contestService = new ContestService();
    var contest = new Contest();

    contest.name = req.body.name;
    contest.date = req.body.date;
    contest.subject = req.body.subject;
    contest.quantity = req.body.quantity;

    var result = await contestService.insertContest(contest);
    res.json({status: true, message: "Insert contest successly"});
});

router.get("/contest-list", async function(req, res){
    var contestService = new ContestService();
    var result = await contestService.getContestList();
    res.json(result);
});

module.exports = router;