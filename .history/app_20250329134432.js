var express = require("express");
var app = express();

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");
app.use("/static", express.static(__dirname + "/public"));
app.use("/assets", express.static(__dirname + "/assets"));

var bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false})); // false: chỉ hỗ trợ chuỗi hoặc mảng. Nên chuyển thành true nếu cần các object lồng nhau
app.use(bodyParser.json());

// Các Middleware cần được khai báo trước router được gọi, nếu không express không thể đọc được req.body
var controller = require(__dirname + "/apps/controllers");
app.use(controller);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});