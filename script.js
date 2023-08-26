import { deck } from './cards.js';

const valueP = document.getElementById('valueP');
const valueC = document.getElementById('valueC');
let IntvalueP = 0;
let IntvalueC = 0;
let playerCards = []
let comCards = []

let playerWins = false;

const clickSound = document.getElementById("clickSound");
const foldSound = document.getElementById("foldSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound"); 
const volumeSlider = document.getElementById("volumeSlider");

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", function () {
        clickSound.volume = volumeSlider.value;
        clickSound.play();
        startGame();
    });

    const takeButton = document.getElementById("take");
    takeButton.addEventListener("click", function () {
        clickSound.volume = volumeSlider.value;
        foldSound.play();
        getCard();
    });

    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function () {
        clickSound.volume = volumeSlider.value;
        clickSound.play();
        resetSlots();
    });

    const stayButton = document.getElementById("stay");
    stayButton.addEventListener("click", function () {
        clickSound.volume = volumeSlider.value;
        foldSound.play();
        stay();
    });
});

async function stay() {
    
    const cardBorderCom = document.getElementById("card-borderCom");
    if (cardBorderCom) { removeChildNodes(cardBorderCom); }
    reloadComCards();
    valueC.textContent = `${IntvalueC}`;
    if (IntvalueC == 21) {
        const cardBorderCom = document.getElementById("card-borderCom");
        if (cardBorderCom) { removeChildNodes(cardBorderCom); }
        reloadComCards();
        valueC.textContent = `${IntvalueC}`;
    } else {
        while (IntvalueC < 17) {
            valueC.textContent = `${IntvalueC}`;
            let delayres = await delay(600);
            foldSound.play();
            placeCardInSlot("C");
            const cardBorderCom = document.getElementById("card-borderCom");
            if (cardBorderCom) { removeChildNodes(cardBorderCom); }
            reloadComCards();
            valueC.textContent = `${IntvalueC}`;
        }
    }
    
    if (IntvalueP == 21 && IntvalueC == 21) {
        playerWins = false;
        winCheck();
    } else if (IntvalueC >= 17 && IntvalueC <= 21) {
        if (IntvalueP > IntvalueC || IntvalueC > 21) {
            playerWins = true;
            winCheck();
        } else {
            playerWins = false;
            winCheck();
        }
    } else {
        if (IntvalueP > IntvalueC || IntvalueC > 21) {
            playerWins = true;
            winCheck();
        } else {
            playerWins = false;
            winCheck();
        }
    }
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

function winCheck() {
    if (playerWins) {
        winSound.play();
    } else {
        loseSound.play();
    }
}

function startGame() {
    resetSlots();
    placeCardInSlot("P");
    placeCardInSlot("P");
    placeCardInSlot("C");
    placeCardInSlot("C", "startCards");

    if (IntvalueC === 21) {
        const cardBorderCom = document.getElementById("card-borderCom");
        if (cardBorderCom) { removeChildNodes(cardBorderCom); }
        reloadComCards();
        playerWins = false;
        winCheck();
    }
}

function getCard() {
    placeCardInSlot("P");

    if (IntvalueP > 21) {
        playerWins = false;
        winCheck();
    }
}

function resetSlots() {
    IntvalueC = 0;
    IntvalueP = 0;
    playerCards = [];
    comCards = [];

    const cardBorderPlayer = document.getElementById("card-borderPlayer");
    const cardBorderCom = document.getElementById("card-borderCom");
    if (cardBorderPlayer) { removeChildNodes(cardBorderPlayer); }
    if (cardBorderCom) { removeChildNodes(cardBorderCom); }

    for (const card of deck) {
        card.dead = false;
    }

    valueP.textContent = ``;
    valueC.textContent = ``;
}

function removeChildNodes(parentNode) {
    while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
    }
}

function placeCardInSlot(mode, action) {
    const card = getRandomAliveCard();
    if (card) {
        if (mode == "P") {
            playerCards.push(card);
            card.dead = true;

            if (card.value === 11 && IntvalueP + 11 > 21) {
                IntvalueP += 1;
            } else {
                IntvalueP += card.value;
            }

            valueP.textContent = `${IntvalueP}`;

            const cardborderPlayer = document.getElementById("card-borderPlayer");
            const cardBorderP = document.createElement("div");
            cardBorderP.classList.add("card-border");
            const cardImageP = document.createElement("img");
            cardImageP.classList.add("card");
            cardImageP.src = playerCards[playerCards.length - 1].src;
            cardImageP.alt = "Added Card";
            cardBorderP.appendChild(cardImageP);
            cardborderPlayer.appendChild(cardBorderP);
        }
        if (mode == "C") {
            comCards.push(card);
            card.dead = true;

            if (card.value === 11 && IntvalueC + 11 > 21) {
                IntvalueC += 1;
            } else {
                IntvalueC += card.value;
            }

            const cardborderCom = document.getElementById("card-borderCom");
            const cardBorderC = document.createElement("div");
            cardBorderC.classList.add("card-border");
            const cardImageC = document.createElement("img");
            cardImageC.classList.add("card");
            if (comCards[1] == card && action == "startCards") {
                cardImageC.src = '/pictures/card_back.png';
            }
            else {
                cardImageC.src = comCards[comCards.length - 1].src;
            }
            cardImageC.alt = "Added Card";
            cardBorderC.appendChild(cardImageC);
            cardborderCom.appendChild(cardBorderC);
        }
    }
}

function reloadComCards() {
    const cardborderCom = document.getElementById("card-borderCom");

    for (const card of comCards) {
        const cardBorderC = document.createElement("div");
        cardBorderC.classList.add("card-border");
        const cardImageC = document.createElement("img");
        cardImageC.classList.add("card");
        cardImageC.src = card.src;
        cardImageC.alt = "Added Card";
        cardBorderC.appendChild(cardImageC);
        cardborderCom.appendChild(cardBorderC);
    }
}

function getRandomAliveCard() {
    const aliveCards = deck.filter(card => !card.dead);
    if (aliveCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * aliveCards.length);
        return aliveCards[randomIndex];
    }
    return undefined;
}
