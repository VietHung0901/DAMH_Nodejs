var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");

var route = express.Router();
var ResultSheet = require("../../entity/resultsheet");
var ResultSheetService = require("../../services/resultsheetService");
var RegistrationService = require("../../services/registrationService");
var UserService = require("../../services/userService");


const { verifyToken, verifyRole } = require('../../util/VerifyToken');

router.get("/", function (req, res) {
    var contest_id = req.query.contest_id;
    res.render("admin/resultsheet/list", { contest_id });
})

router.get("/insert", function (req, res) {
    var contest_id = req.query.contest_id;
    res.render("admin/resultsheet/insert", { contest_id });
})

router.get("/resultsheet-list-by-contest_id", async function (req, res) {
    var resultsheetService = new ResultSheetService();
    var contest_id = new ObjectId(req.query.contest_id);
    var resultsheet = await resultsheetService.getResultSheetListByContest_Id(contest_id);
    res.json(resultsheet);
});

router.post("/check-resultsheet", verifyToken, verifyRole("admin"), async (req, res) => {
    const contest_id = req.query.contest_id;
    const data = req.body.data;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: "Dữ liệu gửi lên không hợp lệ hoặc trống." });
    }

    const resultsheetService = new ResultSheetService();
    const registrationService = new RegistrationService();
    const userService = new UserService();

    try {
        const resultSheets = [];

        for (const row of data) {
            const { userName, score, minute, second, email } = row;

            let status = "Hợp lệ"; // Mặc định là hợp lệ
            let registration = null;

            const user = await userService.getUserByEmail(email);
            registration = await registrationService.getRegistrationByContestAndUsername(contest_id, userName);

            if (!registration) {
                status = "Không tồn tại đăng ký";
            } else if (!user || user.username !== userName) {
                status = "Sai thông tin người dùng";
            } else {
                const existed = await resultsheetService.getResultSheetListByContestIdAndUsername(contest_id, userName);
                if (existed && existed.length > 0) {
                    status = "Đã tồn tại điểm";
                }
            }

            resultSheets.push({
                userName,
                score,
                minute,
                second,
                email,
                status
            });
        }

        // Trả về danh sách đã kiểm tra
        res.status(200).json({
            message: "Kiểm tra dữ liệu thành công.",
            data: resultSheets
        });

    } catch (error) {
        console.error("Lỗi kiểm tra dữ liệu:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xử lý dữ liệu." });
    }
});


router.post("/insert-resultsheet-json", verifyToken, verifyRole("admin"), async (req, res) => {
    const contest_id = req.query.contest_id;
    const data = req.body.data;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: "Dữ liệu gửi lên không hợp lệ hoặc trống." });
    }

    const resultsheetService = new ResultSheetService();
    const registrationService = new RegistrationService();

    try {
        const resultSheets = [];

        for (const row of data) {
            const { userName, score, minute, second, email } = row;

            const registration = await registrationService.getRegistrationByContestAndUsername(contest_id, userName);
            if (!registration) {
                console.warn(`Không tìm thấy đăng ký cho: ${userName}`);
                continue; // hoặc throw error tuỳ yêu cầu
            }

            const resultSheet = new ResultSheet(
                new ObjectId(),
                registration._id,
                score,
                minute,
                second
            );

            resultSheets.push(resultSheet);
        }

        const result = await resultsheetService.insertResultSheets(resultSheets);

        res.status(200).json({
            message: `Import thành công ${result.insertedCount} bản ghi.`,
            insertedCount: result.insertedCount
        });

    } catch (error) {
        console.error("Lỗi import dữ liệu JSON:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xử lý dữ liệu JSON." });
    }
});

module.exports = router;