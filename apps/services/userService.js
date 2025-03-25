const { ObjectId } = require('mongodb');
var config = require('../../config/setting.json');

class UserService{
    databaseConnection = require('../database/database');

    client;
    mosDatabase;
    userCollection;
    constructor(){
        this.client = this.databaseConnection.getMongoClient();
        this.mosDatabase = this.client.db(config.mongodb.database);
        this.userCollection = this.mosDatabase.collection("user");
    }

    async insertUser(user){
        return await this.userCollection.insertOne(user);
    }

    async updateUser(user){
        return await this.userCollection.updateOne({ "_id": new ObjectId(user._id) }, { $set: user });
    }

    async getUserList(){
        const cursor = await this.userCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }

    async getUser(id){
        return await this.userCollection.findOne({ "_id": new ObjectId(id)});
    }

    async getUserByUsername(username){
        return await this.userCollection.findOne({ "username": username });
    }

    async getUserByEmail(email){
        return await this.userCollection.findOne({ "email": email });
    }
}

module.exports = UserService;