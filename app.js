const komako = {};

const yourCode = $("#yourCode");
const matchCode = $("#matchCode");
const modalCounter = $("#modalCounter");
const controllerBtn = $(".controllerButton");
const counter = $("#counter");
const counterText = $("#counterText");

komako.buttons = [
    {
        letter: "W",
        keyNumbers: 119,
        arrows: `<i aria-hidden="true" class="fas fa-arrow-up"></i><span class="srOnly">up</span>`
    },
    {
        letter: "A",
        keyNumbers: 97,
        arrows: `<i aria-hidden="true" class="fas fa-arrow-left"></i><span class="srOnly">left</span>`
    },
    {
        letter: "S",
        keyNumbers: 115,
        arrows: `<i aria-hidden="true" class="fas fa-arrow-down"></i><span class="srOnly">down</span>`
    },
    {
        letter: "D",
        keyNumbers: 100,
        arrows: `<i aria-hidden="true" class="fas fa-arrow-right"></i><span class="srOnly">right</span>`
    },
    {
        letter: "K",
        keyNumbers: 107,
        arrows: `<span class="ABbutton">K</span>`
    },
    {
        letter: "L",
        keyNumbers: 108,
        arrows: `<span class="ABbutton">L</span>`
    }
];

komako.konami = ["W", "W", "S", "S", "A", "D", "A", "D", "K", "L"];

komako.random = (num) => rng = Math.floor(Math.random() * num);

komako.showCount = (count, location) => location.text(count);

komako.touchEnabled = () => {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

komako.displayArrows = (array) => {
    array.forEach((el) => {
        let arrowSymb = el.arrows;
        matchCode.append(`<li>${arrowSymb}</li>`);
    });
}

komako.countdown = (time, location) => {
    komako.showCount(time, location);
    time--;
    timer = window.setInterval(() => {
        komako.showCount(time, location);
        time--;
        if (time < 0) clearInterval(timer);
    }, 1000);
}

// start game
komako.generate = (size, keysOrBtns) => {
    komako.generateCode = []
    for (let i = 0; i < size; i++) {
        let random = komako.random(komako.buttons.length);
        komako.generateCode.push(komako.buttons[random]);
    }
    komako.displayArrows(komako.generateCode);

    // FUTURE: let user choose timer length by selecting difficulty (5 or 10 sec)
    const time = 5;
    modalCounter.show();
    komako.countdown(time, modalCounter);
    window.setTimeout(() => {
        modalCounter.hide();
        matchCode.hide();
        counterText.show();
        komako.userEnterCode(size, keysOrBtns);
    }, time * 1000);
}

// keyboard users to use WASD to enter code
komako.desktopInput = (size) => {
    return new Promise((resolve) => {
        $(document).on("keypress", (e) => {
            if (komako.guessCode.length < size) {
                for (let i = 0; i < komako.buttons.length; i++) {
                    if (e.which === komako.buttons[i].keyNumbers) {
                        komako.guessCode.push(komako.buttons[i].letter);
                        komako.showCount(komako.guessCode.length, counter);
                        if (komako.guessCode.length === size) {
                            resolve(komako.guessCode);
                        }
                        break;
                    }
                }
            }
        }); // end of event listener
    }); // end of promise
}

// touchscreen users to use "clicks" to enter code
komako.mobileInput = (size) => {
    return new Promise((resolve) => {
        controllerBtn.on("click", function () {
            if (komako.guessCode.length < size) {
                komako.guessCode.push(this.id);
                komako.showCount(komako.guessCode.length, counter);
                if (komako.guessCode.length === size) {
                    resolve(komako.guessCode);
                }
            }
        }); // end of event listener
    }); // end of promise
}

komako.checkAnswer = (result) => {
    komako.score = 0;
    let konami = 0;
    let rightOrWrong;
    for (let i = 0; i < result.length; i++) {
        // display user entered code
        for (let j = 0; j < komako.buttons.length; j++) {
            if (result[i] === komako.buttons[j].letter) {
                const arrow = komako.buttons[j].arrows;
                yourCode.append(`<li>${arrow}</li>`);
                break;
            }
        }
        // check if user code matches generated code
        if (result[i] === komako.generateCode[i].letter) {
            rightOrWrong = "right";
            komako.score += 1;
        } else rightOrWrong = "wrong";
        if (result[i] === komako.konami[i]) konami++;
        $(`#yourCode li:nth-child(${i + 1})`).addClass(rightOrWrong);
    }
    // display score out of 10
    matchCode.show();
    counterText.hide();
    if (konami === komako.konami.length) {
        komako.score = "1,000,000";
        yourCode.children().addClass("konami");
    }
    $("#total").text(`${komako.score}/10`).show();
    $("#again").show();
}

// wait for user input size === generated code size
komako.userEnterCode = (size, keysOrBtns) => {
    komako.guessCode = [];
    $.when(keysOrBtns(size))
        .then((guessCode) => {
            $(document).off("keypress");
            $(".controllerButton").off("click");
            komako.checkAnswer(guessCode);
        });
}

komako.newGameSetup = () => {
    $("#total").hide();
    $("#again").hide();
    counter.text(0);
    counterText.hide();
    modalCounter.hide();
}

komako.restartGame = (size, keysOrBtns) => {
    $("#playAgain").on("click", () => {
        komako.newGameSetup();
        matchCode.empty();
        yourCode.empty();
        komako.generate(size, keysOrBtns);
    })
}

komako.mobileOrDesktop = () => {
    if (komako.touchEnabled()) {
        $("#userEnterMode").text("controller");
        $("table").hide();
        $(".refLetter").hide();
        $("img").removeClass("hide");
        controllerBtn.removeClass("hide");
        return komako.mobileInput;
    } else {
        return komako.desktopInput;
    }
}

komako.init = () => {
    const codeLength = 10;
    komako.newGameSetup();
    const inputMethod = komako.mobileOrDesktop();
    $("#start").on("click", (e) => {
        e.preventDefault();
        $("body").css("overflow", "auto");
        $(".modal").hide();
        $(".modalOverlay").hide();
        $("#refreshBtn").removeAttr("tabindex", "aria-hidden");
        komako.generate(codeLength, inputMethod);
    });
    komako.restartGame(codeLength, inputMethod);
}

$(function () {
    komako.init();
}); // end of document ready