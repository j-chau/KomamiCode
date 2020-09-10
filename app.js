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
// o compare cheat code array at [i] to answer array at [i]:
//     o for each i in answer array, if !== to cheat code array; score -= 1; else score += 1;
// o display score out of 10
// o show button with event listener to play again (same trigger as modal button)

komako.buttons = [
    {
        letter: "W",
        keyNumbers: 119,
        arrows: `<i class="far fa-arrow-alt-circle-up"></i>`
    },
    {
        letter: "A",
        keyNumbers: 97,
        arrows: `<i class="far fa-arrow-alt-circle-left"></i>`
    },
    {
        letter: "S",
        keyNumbers: 115,
        arrows: `<i class="far fa-arrow-alt-circle-down"></i>`
    },
    {
        letter: "D",
        keyNumbers: 100,
        arrows: `<i class="far fa-arrow-alt-circle-right"></i>`
    },
    {
        letter: "K",
        keyNumbers: 107,
        arrows: `<p class="ABbutton">K</p>`
    },
    {
        letter: "L",
        keyNumbers: 108,
        arrows: `<p class="ABbutton">L</p>`
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

komako.generate = []
komako.generateCode = (size) => {
    for (let i = 0; i < size; i++) {
        let random = komako.random(komako.buttons.length);
        komako.generate.push(komako.buttons[random]);
    }
    komako.displayArrows(komako.generate);
}

komako.guessCode = [];
komako.userEnterCode = (size) => {
    return new Promise((resolve, reject) => {
        $(document).on("keypress", (e) => {
            if (komako.guessCode.length < size) {
                for (let i = 0; i < komako.buttons.length; i++) {
                    if (komako.buttons[i].keyNumbers === e.which) {
                        komako.guessCode.push(komako.buttons[i].letter);
                    }
                }
                $("#counter").text(komako.guessCode.length);
            }
            if (komako.guessCode.length === size) {
                resolve(komako.guessCode);
                return;
            }
        }); // end of event listener
    }); // end of promise
}
komako.mobile = (size) => {
    return new Promise((resolve, reject) => {
        $(".controllerButton").on("click", function () {
            if (komako.guessCode.length < size) {
                komako.guessCode.push(this.id);
                $("#counter").text(komako.guessCode.length);
            }
            if (komako.guessCode.length === size) {
                resolve(komako.guessCode);
                return;
            }
        }); // end of event listener
    }); // end of promise
}

komako.checkAnswer = async (size) => {
    let result;
    console.log("waiting");
    if (window.matchMedia('(max-width: 768px)').matches) {
        result = await komako.mobile(size);

        console.log("mobile view");
    } else {
        result = await komako.userEnterCode(size);

        console.log("desktop view");
    }

    console.log("done");
    console.log(result);
}

komako.init = (codeLength) => {
    console.log("run ");
    komako.generateCode(codeLength);
    komako.checkAnswer(codeLength, komako.generate);
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