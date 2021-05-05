const express = require("express");
const fs = require("fs");
const path = require("path");

let users = {};
const questions = require('./questions')

function getContents(file) {
    return fs.readFileSync(file, {
        encoding: "utf-8",
        flag: "r",
    });
}

function upusers() {
    users = JSON.parse(getContents(path.join(path.dirname(__dirname), "users.json")));
}
function updb() {
    fs.writeFileSync(path.join(path.dirname(__dirname), "users.json"), JSON.stringify(users));
}

const server = express();

server.use("/s", express.json());
server.use(express.static("images"));

server.get("/", (request, response) => {
    console.log("get /");
    response.end(getContents(path.join(path.dirname(__dirname), "html", "index.html")).replace("{{}}", JSON.stringify(questions)));
});


server.post("/s", (request, response) => {
    let name = request.body.name
    let uname = name.replace(/[^a-zA-Z0-9_-]/ig, "")
    upusers();
    if (Object.keys(users).includes(uname)) {
        let d= users[uname].counter;
        users[uname].counter++;
        users[uname+d] = {
            name: name,
            ques: request.body.ques,
            counter: 0
        };
        response.end(request.protocol+'://'+ request.hostname+'/'+uname+d);
    } else {
        users[uname] = {
            name: name,
            ques: request.body.ques,
            counter: 0
        };
        response.end(request.protocol+'://'+ request.hostname+'/'+uname);
    }
    updb();
    console.log(request.body);
    
});

server.get('/:person', (request,response)=>{
    let person=request.params.person;
    upusers()
    let data={}
    if (Object.keys(users).includes(person)) {
        data.name = users[person].name
        data.ques = []
        users[person].ques.forEach(q=>{
            data.ques.push({
                q:questions[q[0]].qo.replace(/{}/g, data.name),
                ops:questions[q[0]].op,
                co: q[1]
            })
        })
        response.end(getContents(path.join(path.dirname(__dirname), "html", "quiz.html")).replace("{{}}", JSON.stringify(data)));
    }
    else {
        response.end('not found')
    }
})

server.listen(process.env.PORT || 80);
