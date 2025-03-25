var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");

var route = express.Router();
var ResultSheet = require("../../entity/resultsheet");
var ResultSheetService = require("../../services/resultsheetService");
var RegistrationService = require("../../services/registrationService");

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


const multer = require("multer");
const XLSX = require("xlsx");
const upload = multer({ storage: multer.memoryStorage() });
// Route để xử lý import file Excel
router.post("/insert-resultsheet-by-excel", upload.single("file"), async (req, res) => {
    var contest_id = req.query.contest_id;
    var resultsheetService = new ResultSheetService();
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
        const resultSheets = await Promise.all(rows.slice(1).map(async (row) => {
            const registration = await registrationService.getRegistrationByContestAndUsername(contest_id, row[0]);
            return new ResultSheet(new ObjectId(), registration._id, row[1], row[2], row[3]);
        }));
           

        // Lưu vào MongoDB
        const result = await resultsheetService.insertResultSheets(resultSheets);

        res.status(200).json({ message: "Import dữ liệu thành công!", insertedCount: result.insertedCount });
    } catch (error) {
        console.error("Lỗi import file Excel:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xử lý file Excel." });
    }
});

module.exports = router;