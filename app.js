const komako = {};

// PSEUDO CODE
// o global variables:
//     x const button array = [W,A,S,D,P,L,B,N] for generating code
//     x const conversion object to convert e.which to corresponding letter on keyboard
//         - ex. object = { 87: "W" }
// o modal appears first when document ready
// o event listener on modal to continue
// o display countdown timer (time = 3s):
//     .setTimeout(t) => if t === 0, return; else time--;
// x generating "cheat code":
//     x const empty array for generated code
//     x for each i in array of length 10, generate random integer between 0 and 7
//     x display each integer as its corresponding index in button array
// o display countdown timer (time = 5s)
// o hide cheat code
// x event listener for keypresses:
//     x const empty array for user's answers
//     x for each keypress, convert e.which to letter on keyboard
//     x push value to answer array
//     x display number of keypresses (array indices + 1); ends at 10
// x compare cheat code array at [i] to answer array at [i]:
//     x for each i in answer array, if !== to cheat code array; score += 1;
// o display score out of 10
// o show button with event listener to play again (same trigger as modal button)

komako.buttons = [
    {
        letter: "W",
        keyNumbers: 119,
        arrows: `<i class="fas fa-arrow-up"></i>`
    },
    {
        letter: "A",
        keyNumbers: 97,
        arrows: `<i class="fas fa-arrow-left"></i>`
    },
    {
        letter: "S",
        keyNumbers: 115,
        arrows: `<i class="fas fa-arrow-down"></i>`
    },
    {
        letter: "D",
        keyNumbers: 100,
        arrows: `<i class="fas fa-arrow-right"></i>`
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

komako.displayArrows = (array) => {
    array.forEach(el => {
        let arrowSymb = el.arrows;
        $("#matchCode").append(`<li>${arrowSymb}</li>`);
    });
}

// wasd => number of available buttons
komako.random = (wasd) => rng = Math.floor(Math.random() * wasd);

komako.showCount = (count) => $("#counter").text(count);

komako.generateCode = []
komako.generate = (size) => {
    for (let i = 0; i < size; i++) {
        let random = komako.random(komako.buttons.length);
        komako.generateCode.push(komako.buttons[random]);
    }
    komako.displayArrows(komako.generateCode);
}

komako.guessCode = [];
komako.desktopInput = (size) => {
    return new Promise((resolve, reject) => {
        $(document).on("keypress", (e) => {
            if (komako.guessCode.length < size) {
                for (let i = 0; i < komako.buttons.length; i++) {
                    if (e.which === komako.buttons[i].keyNumbers) {
                        komako.guessCode.push(komako.buttons[i].letter);
                        komako.showCount(komako.guessCode.length);
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
    return new Promise((resolve, reject) => {
        $(".controllerButton").on("click", function () {
            if (komako.guessCode.length < size) {
                komako.guessCode.push(this.id);
                komako.showCount(komako.guessCode.length);
                if (komako.guessCode.length === size) {
                    resolve(komako.guessCode);
                }
            }
        }); // end of event listener
    }); // end of promise
}

komako.score = 0;
komako.checkAnswer = (result) => {

    console.log(komako.generateCode);
    console.log(result);

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
        $(`#yourCode li:nth-child(${i + 1})`).addClass(rightWrong);
    }
    console.log(komako.score);
    $("#counter").hide();
    $("#total").text(`${komako.score}/10`).show();
    $("#again").show();
}

komako.userEnterCode = size => {
    let waitFor;
    if (window.matchMedia('(max-width: 768px)').matches) {
        waitFor = komako.mobileInput;

        console.log("mobile view");
    } else {
        waitFor = komako.desktopInput;

        console.log("desktop view");
    }
    console.log("waiting");
    $.when(waitFor(size))
        .then((guessCode) => {
            console.log("done");
            komako.checkAnswer(guessCode);
        })
}

komako.init = (codeLength) => {
    console.log("run ");
    $("#total").hide();
    $("#again").hide();
    komako.generate(codeLength);
    komako.userEnterCode(codeLength);

    // komako.guessCode = ["K", "D", "A", "W", "S", "D", "L", "L", "S", "L"];
    // komako.checkAnswer(komako.guessCode);
}

// komako.generate => array of objects
// komako.userEnterCode => array of letters (both mobile and desktop)

$(function () {
    komako.init(10);
    // $("#again").on("submit", function (e) {
    //     e.preventDefault();
    //     console.log(komako.random(5));
    // });


}); // end of document ready