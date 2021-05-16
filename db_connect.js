const nedb = require("nedb");
const db = new nedb({
    filename: "./URLData.db"
});
db.loadDatabase(err => {
    if (!err) {
        console.log("db found/created successfully");
    } else {
        console.log(err);
    }
});

module.exports = db;