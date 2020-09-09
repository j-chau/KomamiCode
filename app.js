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
// o generating "cheat code":
//     x const empty array for generated code
//     x for each i in array of length 10, generate random integer between 0 and 7
//     o display each integer as its corresponding index in button array
// o display countdown timer (time = 5s)
// o hide cheat code
// o event listener for keypresses:
//     o const empty array for user's answers
//     o for each keypress, convert e.which to letter on keyboard
//     o push value to answer array
//     o display number of keypresses (array indices + 1); ends at 10
// o compare cheat code array at [i] to answer array at [i]:
//     o for each i in answer array, if !== to cheat code array; score -= 1; else score += 1;
// o display score out of 10
// o show button with event listener to play again (same trigger as modal button)

komako.buttons = ["W", "A", "S", "D", "K", "L"];
komako.keyNumbers = {
    119: "W",
    97: "A",
    115: "S",
    100: "D",
    107: "K",
    108: "L"
}
komako.arrows = {
    W: `<i class="fas fa-arrow-alt-circle-up"></i>`,
    A: `<i class="fas fa-arrow-alt-circle-left"></i>`,
    S: `<i class="fas fa-arrow-alt-circle-down"></i>`,
    D: `<i class="fas fa-arrow-alt-circle-right"></i>`,
    K: `<p class="ABbutton">K</p>`,
    L: `<p class="ABbutton">L</p>`,

}
komako.convertToArrows = (array) => {
    array.forEach(el => {
        console.log(el);
    });
}
// wasd => number of available buttons
komako.random = (wasd) => rng = Math.floor(Math.random() * wasd);

komako.generate = []
// generating random code
komako.generateCode = (size) => {
    for (let i = 0; i < size; i++) {
        let random = komako.random(komako.buttons.length);
        komako.generate.push(komako.buttons[random]);
    }
    // $("#matchCode").text(komako.generate.join("  |  "));
    console.log(komako.generate.join(" | "));
    console.log(komako.convertToArrows(komako.generate));
}


komako.init = () => {
    console.log("run ");
    komako.generateCode(10);
    // $(document).on("keypress", (e) => {
    //     console.log(e.which);
    //});
}

$(function () {
    komako.init();
    // $("#again").on("submit", function (e) {
    //     e.preventDefault();
    //     console.log(komako.random(5));
    // });
}); // end of document ready