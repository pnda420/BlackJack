import { deck } from './cards.js';
const card1 = document.getElementById('card1');
const card2 = document.getElementById('card2');

let slotOneHasCard = false;
let slotTwoHasCard = false;

document.addEventListener("DOMContentLoaded", function () {
    var meinButton = document.getElementById("meinButton");
    meinButton.addEventListener("click", function () {
        changeCard();
    });
});

function changeCard() {
    console.log(slotOneHasCard);
        console.log(slotTwoHasCard);
   
        if(slotOneHasCard && slotTwoHasCard){
            card1.src = "";
            card2.src = "";
            slotOneHasCard = false;
            slotTwoHasCard = false;
        }else  if(slotOneHasCard == true && slotTwoHasCard == false){
            const card = getRandomAliveCard();
            if (card) { card2.src = card.src }
            slotTwoHasCard = true;
        }else if(slotOneHasCard == false){
            const card = getRandomAliveCard();
            if (card) { card1.src = card.src }
            slotOneHasCard = true;
        }
    
     

   

    



    const aliveCardsCount = deck.filter(card => !card.dead).length;
    console.log(`Anzahl der lebenden Karten: ${aliveCardsCount}`);

}

function getRandomAliveCard() {
    let randomIndex;
    let selectedCard;

    if (deck.filter(card => !card.dead).length > 0) {
        do {
            randomIndex = Math.floor(Math.random() * deck.length);
            selectedCard = deck[randomIndex];
        } while (selectedCard.dead);
        selectedCard.dead = true;
        return selectedCard;
    } else {
        return undefined
    }



}


