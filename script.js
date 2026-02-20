const ui = {
    startScreen:    document.querySelector("#startQuizContainer"),
    quizScreen:     document.querySelector("#quizContent"),
    resultScreen:   document.querySelector("#quizResultContainer"),

    startBtn:       document.querySelector("#startQuizBtn"),

    questionText:   document.querySelector("#questionText"),
    options:        document.querySelectorAll("input[name='answer']"),

    endQuiz: {
        resultText:     document.querySelector("#resultText"),
        resultSubtext:  document.querySelector("#resultSubtext"),
        restartBtn:     document.querySelector("#restartBtn"),
    },
};

let userScore = 0;
let currentQuestion = 0;
const kb = []

ui.startBtn.addEventListener("click", async () => {
    switchScreen(ui.quizScreen);
    if (kb.length === 0) {
        await fetchData();
    }
    loadContent();
});

ui.endQuiz.restartBtn.addEventListener("click", () => {
    switchScreen(ui.startScreen);
});

// Fetch data

async function fetchData () {
    const response = await fetch("kb.JSON")
    const data = await response.json();
    data.forEach((item) => {
        kb.push(item)
    })
    console.log(kb)
}


// UI

function switchScreen(target) {
    const screens = [
        ui.startScreen,
        ui.quizScreen,
        ui.resultScreen
    ];

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    target.classList.add("active");
};


function loadContent () {
    if (currentQuestion <= 14) {
        let currentOption = 0;
        ui.questionText.textContent = kb[currentQuestion].question;

        ui.options.forEach(option => {
            const value = option.value;
            const span = option.nextElementSibling;
            span.textContent = kb[currentQuestion].options[currentOption];
            currentOption++
        })
    } else {

        ui.endQuiz.resultText.textContent = `Your score is: ${userScore} / ${kb.length}`;
        resultFeedback();

        switchScreen(ui.resultScreen);
        currentQuestion = 0;
        userScore = 0;
    }
}

// Check Answer

ui.options.forEach(option => {
    option.addEventListener("change", checkAnswer)
});

function checkAnswer (e) {
    const option = e.target;
    const span = option.nextElementSibling;
    if (span.textContent == kb[currentQuestion].answer) {
        userScore++;
        currentQuestion++;

        span.style.color = "green"
        

        setTimeout(() => {
            span.style.color = "black"
            loadContent();
            clearSelection();
        }, 1000);
        console.log(userScore)
    } else {
        currentQuestion++;

        span.style.color = "red"

        setTimeout(() => {
            span.style.color = "black"
            loadContent();
            clearSelection();
        }, 1000);
    }
};

function clearSelection () {
    ui.options.forEach(option => {
        option.checked = false;
    })
};

// End result feedback

function resultFeedback () {
    if (userScore >= 15) {
        ui.endQuiz.resultSubtext.textContent = "Perfect!"
    } else if (userScore >= 12) {
        ui.endQuiz.resultSubtext.textContent = "You know quite a lot."
    } else if (userScore >= 8) {
        ui.endQuiz.resultSubtext.textContent = "Not bad, but keep practicing!"
    } else if (userScore >= 4) {
        ui.endQuiz.resultSubtext.textContent = "I mean, it could be worse. If you lock in for a week, mabye you will get above 12."
    } else {
        ui.endQuiz.resultSubtext.textContent = "No comment..."
    }
};