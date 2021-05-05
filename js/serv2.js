const fastify = require("fastify")({
    logger: true,
});
const fs = require("fs");
const path = require("path");

let users = {};
const questions = require("./questions");

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

fastify.get("/", (request, reply) => {
    reply
        .status(200)
        .header('Content-Type', 'text/html')
        .send(getContents(path.join(path.dirname(__dirname), "html", "index.html")).replace("{{}}", JSON.stringify(questions)))
});

fastify.listen(process.env.PORT || 80, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
});
