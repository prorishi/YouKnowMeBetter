const typing = new Audio("/sounds/typing.mp3");

const qNumberSelect = document.getElementById("number-of-q"),
    qArea = document.getElementById("q"),
    optionsArea = document.getElementById("options"),
    qHash = document.getElementById("q-hash"),
    skipButton = document.getElementById("skip"),
    page1 = document.getElementById("page-1"),
    page2 = document.getElementById("page-2"),
    page3 = document.getElementById("page-3"),
    linkInfo = document.getElementById("link-info"),
    copyButton = document.getElementById("copy"),
    linkHolder = document.getElementById("link"),
    waButton = document.getElementById("wa"),
    nameField = document.getElementById("user-name"),
    nameForm = document.forms[0];
let hash = 0;
let currentQ;
let numOfQ = 12;
let questionsChosen = (skippedQ = []);

const self = {
    questions: [],
};

function chooseQuestion() {
    let qIndex = Math.floor(Math.random() * questions.length);
    if (!questionsChosen.includes(qIndex)) {
        questionsChosen.push(qIndex);
        return questions[qIndex];
    }
}
function displayQuestion() {
    currentQ = chooseQuestion();
    if (currentQ) {
        qArea.textContent = currentQ.q;
        optionsArea.replaceChildren();
        currentQ.op.forEach((opText) => {
            let option = document.createElement("button");
            let optionImage = document.createElement("img");
            let opLabel = document.createElement("div");
            option.appendChild(optionImage);
            option.appendChild(opLabel);
            opLabel.appendChild(document.createTextNode(opText));
            optionImage.setAttribute("src", location.origin + "/images/" + opText.toLowerCase().replace(/ /gi, "-") + ".jpg");
            optionImage.setAttribute("width", 150);
            option.onclick = () => {
                optionClicked(option, currentQ);
            };
            optionsArea.appendChild(option);
        });

        hash += 1;
        qHash.textContent = "Q" + hash;
    } else {
        displayQuestion();
    }
}

function optionClicked(el, q) {
    if (hash > 4) {
        qNumberSelect.firstElementChild.remove();
    }
    self.questions.push([q.n, q.op.indexOf(el.innerText)]);
    if (hash >= numOfQ) {
        page2.remove();
        fetch("/s", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "post",
            body: JSON.stringify(self),
        }).then((response) =>
            response.text().then((url) => {
                page3.removeAttribute("hidden");
                document.getElementById("link-actions").removeAttribute("hidden");
                linkInfo.textContent = "Here is your Quiz Link; Send to all your friends!!";
                linkHolder.value = url;
                waButton.onclick = () => {
                    open(
                        "whatsapp://send?text=So%20you%20think%20you%20know%20about%20" + self.name + "%20better%20than%20anyone%20else?%0AAttempt%20the%20quiz%20to%20prove%20it!!%0A" + url,
                        "_blank"
                    );
                };
            })
        );
    }
    displayQuestion();
}

nameField.oninput = () => {
    typing.play();
    console.log("s");
    setTimeout(() => {
        typing.pause();
        console.log("p");
    }, 400);
};

nameForm.onsubmit = (submitEvent) => {
    submitEvent.preventDefault();
    self.name = nameField.value;
    page1.remove();
    setTimeout(() => {
        page2.removeAttribute("hidden");
    }, 200);
    displayQuestion();
};

skipButton.onclick = () => {
    questionsChosen.pop();
    hash -= 1;
    displayQuestion();
};

linkHolder.onclick = copyButton.onclick = () => {
    let linkLabel = document.getElementById("link");
    linkLabel.select();
    linkLabel.setSelectionRange(0, 999);
    document.execCommand("copy");
};
