const { ObjectId } = require("mongodb");

class Registration {
    constructor(_id, date, user_id, contest_id) {
        this._id = _id ? new ObjectId(_id) : undefined;
        this.date = date;
        this.user_id = user_id ? new ObjectId(user_id) : undefined;
        this.contest_id = contest_id ? new ObjectId(contest_id) : undefined;
    }
}

module.exports = Registration;
