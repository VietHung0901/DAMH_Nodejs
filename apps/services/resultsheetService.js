const { ObjectId } = require('mongodb');
var config = require('../../config/setting.json');

class ResultSheetService {
    databaseConnection = require('../database/database');

    client;
    mosDatabase;
    resultsheetCollection;
    constructor() {
        this.client = this.databaseConnection.getMongoClient();
        this.mosDatabase = this.client.db(config.mongodb.database);
        this.resultsheetCollection = this.mosDatabase.collection("resultsheet");
    }

    async insertResultSheet(resutlsheet) {
        return await this.resultsheetCollection.insertOne(resutlsheet);
    }

    async insertResultSheets(resultSheets) {
        return await this.resultsheetCollection.insertMany(resultSheets);
    }    

    async getResultSheetListByContest_Id(contest_id) {
        const cursor = await this.resultsheetCollection.aggregate([
            {
                $lookup: {
                    from: "registration",
                    localField: "registration_id",
                    foreignField: "_id",
                    as: "registration"
                }
            },
            { $unwind: "$registration" },
            {
                $match: { "registration.contest_id": new ObjectId(contest_id) }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "registration.user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    score: 1,
                    minute: 1,
                    second: 1,
                    username: "$user.username"
                }
            }
        ]).toArray();

        return cursor;
    }
}
module.exports = ResultSheetService;
