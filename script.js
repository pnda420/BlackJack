import { deck } from './cards.js';

const valueP = document.getElementById('valueP');
const valueC = document.getElementById('valueC');
let IntvalueP = 0;
let IntvalueC = 0;
let playerCards = []
let comCards = []

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", startGame);
    const takeButton = document.getElementById("take");
    takeButton.addEventListener("click", getCard);
    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", resetSlots);
    const stayButton = document.getElementById("stay");
    stayButton.addEventListener("click", stay);
    const revealButton = document.getElementById("reveal");
    revealButton.addEventListener("click", reveal);
});


function stay() {
    while (IntvalueC < 17) {
        if (IntvalueC < 17) {
            placeCardInSlot("C");
        }
        const cardBorderCom = document.getElementById("card-borderCom");
        if (cardBorderCom) { removeChildNodes(cardBorderCom); }
        reloadComCards();
    }
    if(IntvalueP > IntvalueC && IntvalueC <= 21){
        console.log("PLAYER WINS");
    }else{
        console.log("COM WINS");
    }
}



function startGame() {
    placeCardInSlot("P");
    placeCardInSlot("P");
    placeCardInSlot("C");
    placeCardInSlot("C", "startCards");
}

function getCard() {
    placeCardInSlot("P");
}

function resetSlots() {
    IntvalueC = 0;
    IntvalueP = 0;
    playerCards = [];
    comCards = [];

    //Remove Cards from DOM
    const cardBorderPlayer = document.getElementById("card-borderPlayer");
    const cardBorderCom = document.getElementById("card-borderCom");
    if (cardBorderPlayer) { removeChildNodes(cardBorderPlayer); }
    if (cardBorderCom) { removeChildNodes(cardBorderCom); }

    for (const card of deck) {
        card.dead = false;
    }

    valueP.textContent = `Value: 0`;
    valueC.textContent = `Value: 0`;
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
            IntvalueP += card.value;
            valueP.textContent = `Value: ${IntvalueP}`;

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
            IntvalueC += card.value;
            valueC.textContent = `Value: ${IntvalueC}`;

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
