var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");

var route = express.Router();
var Registration = require("../../entity/Registration");
var RegistrationService = require("../../services/registrationService");
var UserService = require("../../services/userService");

const { verifyToken, verifyRole } = require('../../util/VerifyToken');

router.get("/", function (req, res) {
    var contest_id = req.query.contest_id;
    res.render("admin/registration/list", { contest_id });
})

router.get("/insert", function (req, res) {
    var contest_id = req.query.contest_id;
    res.render("admin/registration/insert", { contest_id });
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
    registration.user_id = new ObjectId(req.body.user_id);
    registration.contest_id = new ObjectId(req.body.contest_id);
    var result = await registrationService.insertRegistration(registration);
    res.json({ status: true, message: "Insert registration successly" });
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

const multer = require("multer");
const XLSX = require("xlsx");
const upload = multer({ storage: multer.memoryStorage() });
router.post("/insert-registration-by-excel", verifyToken, verifyRole("admin"), upload.single("file"), async (req, res) => {
    const contest_id = req.query.contest_id;
    const userService = new UserService();
    var registrationService = new RegistrationService();
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Vui lòng tải lên một file Excel." });
        }

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });

        if (rows.length < 2) {
            return res.status(400).json({ message: "File Excel không có dữ liệu hợp lệ." });
        }

        // Bỏ qua dòng tiêu đề và xử lý dữ liệu
        const registration = await Promise.all(rows.slice(1).map(async (row) => {
            const username = row[0];
            const excelDate = row[1];
            const user = await userService.getUserByUsername(username);
        
            // Chuyển đổi từ Excel serial date sang định dạng ISO
            const jsDate = typeof excelDate === 'number' 
                ? new Date((excelDate - 25569) * 86400 * 1000) // 25569 là số ngày từ 01/01/1900 đến 01/01/1970
                : new Date(excelDate);
        
            const isoDate = jsDate.toISOString().split('T')[0]; // '2025-04-09'
        
            return new Registration(new ObjectId(), isoDate, new ObjectId(user._id), new ObjectId(contest_id));
        }));
        
        // Lưu vào MongoDB
        const result = await registrationService.insertManyRegistration(registration);

        res.status(200).json({ message: "Import dữ liệu thành công!", insertedCount: result.insertedCount });
    } catch (err) {
        res.status(500).json({ message: "Lỗi máy chủ khi xử lý file Excel." });
    }
});

module.exports = router;