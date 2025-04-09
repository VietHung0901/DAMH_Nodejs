const { ObjectId } = require('mongodb');
var config = require("../../config/setting.json");

class RegistrationService {
    dataConnection = require("../database/database");

    client;
    mosDatabase;
    registrationCollection;
    constructor() {
        this.client = this.dataConnection.getMongoClient();
        this.mosDatabase = this.client.db(config.mongodb.database);
        this.registrationCollection = this.mosDatabase.collection("registration");
    }

    async insertRegistration(registration) {
        return await this.registrationCollection.insertOne(registration);
    }

    async insertManyRegistration(registration) {
        return await this.registrationCollection.insertMany(registration);
    }

    // Hàm dùng để lấy danh sách phiếu đăng ký theo contest_id, dùng lookup để truy vấn qua các collection khác
    async getRegistrationListByContest_id(contest_id) {
        const cursor = await this.registrationCollection.aggregate([
            { $match: { contest_id: new ObjectId(contest_id) } }, // Tìm contest_id tương ứng
            {
                $lookup: {
                    from: "user", // Liên kết với collection "user"
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "contest", // Liên kết với collection "contest"
                    localField: "contest_id",
                    foreignField: "_id",
                    as: "contest"
                }
            },
            { $unwind: "$user" },   // Chuyển mảng thành object
            { $unwind: "$contest" }, // Chuyển mảng thành object
            {
                $project: {
                    _id: 1,
                    date: 1,
                    username: "$user.username", // Lấy username thay vì user_id
                    contest_name: "$contest.name" // Lấy tên cuộc thi thay vì contest_id
                }
            },
            { $limit: 100 }
        ]);

        return await cursor.toArray();
    }

    async getRegistrationByContestAndUsername(contest_id, username) {
        return await this.registrationCollection.aggregate([
            { $match: { contest_id: new ObjectId(contest_id) } },
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "contest",
                    localField: "contest_id",
                    foreignField: "_id",
                    as: "contest"
                }
            },
            { $unwind: "$user" },
            { $unwind: "$contest" },
            { $match: { "user.username": username } }, // Lọc theo username
            {
                $project: {
                    _id: 1,
                    date: 1,
                    username: "$user.username",
                    contest_name: "$contest.name"
                }
            }
        ]).next(); // Lấy một bản ghi đầu tiên
    }

}

module.exports = RegistrationService;
