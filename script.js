import { deck } from './cards.js';

const pCard1 = document.getElementById('pCard1');
const pCard2 = document.getElementById('pCard2');
const cCard1 = document.getElementById('cCard1');
const cCard2 = document.getElementById('cCard2');
const valueP = document.getElementById('valueP');
const valueC = document.getElementById('valueC');
let IntvalueP = 0;
let IntvalueC = 0;



// Warte, bis das DOM geladen ist
document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", getCards);
    const reset = document.getElementById("reset");
    reset.addEventListener("click", resetSlots);

});

function getCards() {

    placeCardInSlot(pCard1, "P");
    placeCardInSlot(pCard2, "P");

    placeCardInSlot(cCard1, "C");
    placeCardInSlot(cCard2, "C");

    const aliveCardsCount = deck.filter(card => !card.dead).length;
    console.log(`Anzahl der lebenden Karten: ${aliveCardsCount}`);
}

function resetSlots() {
    pCard1.src = "/pictures/Empty.png";
    pCard2.src = "/pictures/Empty.png";
    cCard1.src = "/pictures/Empty.png";
    cCard2.src = "/pictures/Empty.png";
    IntvalueC = 0;
    IntvalueP = 0;
    valueP.textContent = `Value: 0`;
    valueC.textContent = `Value: 0`;
}

function placeCardInSlot(slot, mode) {
    const card = getRandomAliveCard();
    if (card) {
        if (mode == "P") {
            IntvalueP += card.value;
            valueP.textContent = `Value: ${IntvalueP}`;
        }
        if (mode == "C") {
            IntvalueC += card.value;
            valueC.textContent = `Value: ${IntvalueC}`;
        }
        slot.src = card.src;
        card.dead = true;
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
