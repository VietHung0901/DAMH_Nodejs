const { ObjectId } = require('mongodb');
var config = require("../../config/setting.json");

class ContestService {
    dataConnection = require('../database/database');

    client;
    mosDatabase;
    contestCollection;
    constructor(){
        this.client = this.dataConnection.getMongoClient();
        this.mosDatabase = this.client.db(config.mongodb.database);
        this.contestCollection = this.mosDatabase.collection("contest");
    }

    async insertContest(contest){
        return await this.contestCollection.insertOne(contest);
    }

    async updateContest(contest){
        return await this.contestCollection.updateOne({"id": new ObjectId(contest._id) }, { $set: contest });
    }

    async getContestList(){
        const cursor = await this.contestCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
}

module.exports = ContestService