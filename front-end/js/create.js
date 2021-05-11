const qNumberSelect = document.getElementById("number-of-q"),
    qArea = document.getElementById("q"),
    optionsArea = document.getElementById("options"),
    qHash = document.getElementById("q-hash"),
    skipButton = document.getElementById("skip"),
    page1 = document.getElementById("page-1"),
    page2 = document.getElementById("page-2"),
    page3 = document.getElementById("page-3"),
    nameForm = document.forms[0];
let hash = 0;
let currentQ;
let numOfQ = 12;
let questionsChosen = skippedQ = [];

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
        // console.log(hash, qc);
        qHash.textContent = "Q" + hash;
    } else {
        displayQuestion();
    }
}

function optionClicked(el, q) {
    if(hash > 4) {
        qNumberSelect.firstElementChild.remove();
    }
    self.questions.push([q.n, q.op.indexOf(el.innerText)]);
    if (hash >= numOfQ) {
        page2.remove();
        page3.innerText = "completed\n generating your link...  ";
        fetch("/s", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "post",
            body: JSON.stringify(self),
        }).then((response) =>
            response.text().then((url) => {
                page3.innerHTML = 'your quiz link <a target="_blank" href="' + url + '">' + url + "</a>";
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
    questionsChosen.pop()
    hash -= 1;
    displayQuestion();
};