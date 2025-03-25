const { ObjectId } = require("mongodb");

class ResultSheet {
    constructor(_id, registration_id, score, minute, second) {
        this._id = _id ? new ObjectId(_id) : undefined;
        this.registration_id = registration_id ? new ObjectId(registration_id) : undefined;
        this.score = score;
        this.minute = minute;
        this.second = second;
    }
}

module.exports = ResultSheet;