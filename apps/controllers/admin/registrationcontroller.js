var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");

var route = express.Router();
var Registration = require("../../entity/Registration");
var RegistrationService = require("../../services/registrationService");

const { verifyToken, verifyRole } = require('../../util/VerifyToken');

router.get("/", function (req, res) {
    var contest_id = req.query.contest_id;
    res.render("admin/registration/list", { contest_id });
})

router.get("/registration-list-by-contest_id", async function (req, res) {
    var registrationService = new RegistrationService();
    var contest_id = req.query.contest_id;
    var registration = await registrationService.getRegistrationListByContest_id(contest_id);
    res.json(registration);
});

router.post("/insert-registration", async function (req, res) {
    var registrationService = new RegistrationService();
    var registration = new Registration();
    registration.date = req.body.date;
    registration.user_id = req.body.user_id;
    registration.contest_id = req.body.contest_id;
    var result = await registrationService.insertRegistration(registration);
    res.json({status: true, message: "Insert registration successly"});
});

router.get("/get-registration", async (req, res) => {
    var registrationService = new RegistrationService();
    try {
        const contest_id = req.query.contest_id;
        const username = req.query.username;

        const registration = await registrationService.getRegistrationByContestAndUsername(contest_id, username);

        if (!registration) {
            return res.status(404).json({ message: "Không tìm thấy đăng ký." });
        }

        res.status(200).json(registration);
    } catch (error) {
        console.error("Lỗi khi lấy registration:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
});

module.exports = router;