const express = require("express");
const fs = require("fs");
const path = require("path");
const questions = require("./questions");

let users = {};
const usersFile = path.join(__dirname, ".users");
const frontEnd = path.join(path.dirname(__dirname), "front-end");

function getContents(file) {
    return fs.readFileSync(file, {
        encoding: "utf-8",
    });
}
function template(file, object) {
    return getContents(path.join(frontEnd, "html", file)).replace("{{}}", JSON.stringify(object));
}

function upusers() {
    users = JSON.parse(getContents(usersFile));
}
function updb() {
    fs.writeFileSync(usersFile, JSON.stringify(users));
}

const server = express();
server.use(express.static(frontEnd));
server.use(express.json());

server.get("/", (request, response) => {
    console.log("get /");
    response.end(template("create.html", questions));
});

server.post("/s", (request, response) => {
    console.log(request.body);
    let name = request.body.name;
    let uname = name.replace(/[^a-zA-Z0-9_-]/gi, "");
    upusers();
    if (Object.keys(users).includes(uname)) {
        let d = users[uname].counter;
        users[uname].counter++;
        users[uname + d] = {
            name: name,
            uname: uname + d,
            ques: request.body.questions,
            friends: [],
            counter: 0,
        };
        response.end(request.protocol + "://" + request.hostname + "/" + uname + d);
    } else {
        users[uname] = {
            name: name,
            uname: uname,
            ques: request.body.questions,
            friends: [],
            counter: 0,
        };
        response.end(request.protocol + "://" + request.hostname + "/" + uname);
    }
    updb();
});

server.get("/:person", (request, response) => {
    let person = request.params.person;
    upusers();
    let data = {};
    if (Object.keys(users).includes(person)) {
        data.name = users[person].name;
        data.f = users[person].friends;
        data.uname = users[person].uname;
        data.ques = [];
        users[person].ques.forEach((q) => {
            let qu= questions.filter((ques)=> ques.n==q[0])[0]
            console.log(qu);
            data.ques.push({
                q: qu.q.replace('Have', 'Has').replace('do', 'does').replace('Do', 'Does').replace(/your/ig, data.name+"'s").replace(/you/ig, data.name),
                ops: qu.op,
                co: q[1],
            });
        });
        response.end(template('attempt.html', data));
    } else {
        response.end("not found");
    }
});

server.post("/sub", (request, response) => {
    upusers();
    let n = request.body;
    let whose = n.whose;
    console.log(n.score, users[whose].friends);
    users[whose].friends.push([n.name, n.score]);
    updb();
    response.end("ok");
});

server.listen(process.env.PORT || 80, (error)=>{
    console.log(
        error
            ? error.message
            : 'http://localhost'
    );
});
