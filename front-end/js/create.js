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
    linkHolder = document.getElementById("link");

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
            })
        );
    }
    displayQuestion();
}

nameForm.onsubmit = (submitEvent) => {
    submitEvent.preventDefault();
    self.name = document.getElementsByName("user-name")[0].value;
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

copyButton.onclick = () => {
    let linkLabel = document.getElementById("link");
    linkLabel.select();
    linkLabel.setSelectionRange(0, 999);
    document.execCommand("copy");
};
