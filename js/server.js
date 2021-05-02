const express = require("express");
const fs = require("fs");
const path = require("path");

const users = {};

function getContents(file) {
    return fs.readFileSync(file, {
        encoding: "utf-8",
        flag: "r",
    });
}

function upusers() {
    users = JSON.parse(getContents("../users.json"));
}
function updb() {
    fs.writeFileSync("../users.json", JSON.stringify(users, null, 4));
}

const server = express();
server.use(
    "/",
    express.urlencoded({
        extended: false,
    })
);

server.use("/helo", express.json());
server.use(express.static("images"));

server.get("/", (request, response) => {
    console.log("get /");
    response.sendFile(path.join(path.dirname(__dirname), "html", "index.html"));
});

server.post("/", (request, response) => {
    console.log("post /");
    console.log(request.body.name);
    response.end(getContents(path.join(path.dirname(__dirname), "html", "create.html")).replace("{{}}", JSON.stringify(require('./questions'))));
});

server.post("/helo", (request, response) => {
    console.log(request.body);
    response.end("ok");
});

server.listen(process.env.PORT || 80);
