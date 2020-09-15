const komako = {};

// PSEUDO CODE
// x global variables:
//     x const button array = [W,A,S,D,P,L,B,N] for generating code
//     x const conversion object to convert e.which to corresponding letter on keyboard
//         - ex. object = { 87: "W" }
// x modal appears first when document ready
// x event listener on modal to continue
// - display countdown timer (time = 3s):
//     .setTimeout(t) => if t === 0, return; else time--;
//   ***** REMOVED FROM APP BECAUSE WAS NOT UX/UI FRIENDLY *****
// x generating "cheat code":
//     x const empty array for generated code
//     x for each i in array of length 10, generate random integer between 0 and 7
//     x display each integer as its corresponding index in button array
// x display countdown timer (time = 5s)
// x hide cheat code
// x event listener for keypresses:
//     x const empty array for user's answers
//     x for each keypress, convert e.which to letter on keyboard
//     x push value to answer array
//     x display number of keypresses (array indices + 1); ends at 10
// x compare cheat code array at [i] to answer array at [i]:
//     x for each i in answer array, if !== to cheat code array; score += 1;
// x display score out of 10
// x show button with event listener to play again (same trigger as modal button)

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

komako.showCount = (count, location) => $("#" + location).text(count);

komako.touchEnabled = () => {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

komako.displayArrows = (array) => {
    array.forEach((el) => {
        let arrowSymb = el.arrows;
        $("#matchCode").append(`<li>${arrowSymb}</li>`);
    });
}

komako.countdown = (time, location) => {
    $("#" + location).text(time);
    time--;
    timer = window.setInterval(() => {
        komako.showCount(time, location);
        time--;
        if (time < 0) clearInterval(timer);
    }, 1000);
}

komako.generate = (size, keysOrBtns) => {
    komako.generateCode = []
    for (let i = 0; i < size; i++) {
        let random = komako.random(komako.buttons.length);
        komako.generateCode.push(komako.buttons[random]);
    }
    komako.displayArrows(komako.generateCode);

    const modalCounter = $("#modalCounter");
    const time = 5;
    modalCounter.show();
    komako.countdown(time, "modalCounter");
    window.setTimeout(() => {
        modalCounter.hide();
        $("#matchCode").hide();
        $("#counterText").show();
        komako.userEnterCode(size, keysOrBtns);
    }, time * 1000);

}

komako.desktopInput = (size) => {
    return new Promise((resolve) => {
        $(document).on("keypress", (e) => {
            if (komako.guessCode.length < size) {
                for (let i = 0; i < komako.buttons.length; i++) {
                    if (e.which === komako.buttons[i].keyNumbers) {
                        komako.guessCode.push(komako.buttons[i].letter);
                        komako.showCount(komako.guessCode.length, "counter");
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
komako.mobileInput = (size) => {
    return new Promise((resolve) => {
        $(".controllerButton").on("click", function () {
            if (komako.guessCode.length < size) {
                komako.guessCode.push(this.id);
                komako.showCount(komako.guessCode.length, "counter");
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
    let rightWrong;
    const yourCode = $("#yourCode");
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < komako.buttons.length; j++) {
            if (result[i] === komako.buttons[j].letter) {
                const arrow = komako.buttons[j].arrows;
                yourCode.append(`<li>${arrow}</li>`);
                break;
            }
        }
        if (result[i] === komako.generateCode[i].letter) {
            rightWrong = "right";
            komako.score += 1;
        } else rightWrong = "wrong";
        if (result[i] === komako.konami[i]) konami++;
        $(`#yourCode li:nth-child(${i + 1})`).addClass(rightWrong);
    }
    $("#matchCode").show();
    $("#counterText ").hide();
    if (konami === 10) {
        komako.score = "1,000,000";
        yourCode.children().addClass("konami");
    }
    $("#total").text(`${komako.score}/10`).show();
    $("#again").show();
}

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
    $("#counter").text(0);
    $("#counterText").hide();
    $("#modalCounter").hide();
}

komako.restartGame = (size, keysOrBtns) => {
    $("#playAgain").on("click", e => {
        komako.newGameSetup();
        $("#matchCode").empty();
        $("#yourCode").empty();
        komako.generate(size, keysOrBtns);
    })
}

komako.mobileDesktop = () => {
    if (komako.touchEnabled()) {
        $("#userEnterMode").text("controller");
        $("table").hide();
        $(".refLetter").hide();
        $("img").removeClass("hide");
        $(".controllerButton").removeClass("hide");
        return komako.mobileInput;
    } else {
        return komako.desktopInput;
    }
}

komako.init = () => {
    const codeLength = 10;
    komako.newGameSetup();
    const inputMethod = komako.mobileDesktop();
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