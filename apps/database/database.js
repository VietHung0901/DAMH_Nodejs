const { use } = require('../controllers');
var config = require("../../config/setting.json");

class DatabaseConnection {
    url;
    user;
    pass;
    constructor() {
    }

    static getMongoClient() {
        this.user = config.mongodb.username;
        this.pass = config.mongodb.password;
        this.url = `mongodb+srv://${this.user}:${this.pass}@cluster0.hh53v.mongodb.net/`;
        
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(this.url);
        return client;
    }
}

module.exports = DatabaseConnection;