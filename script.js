import { deck } from './cards.js';

const valueP = document.getElementById('valueP');
const valueC = document.getElementById('valueC');
const totalMoney = document.getElementById('totalMoney');
const betMoney = document.getElementById('bet');
let IntvalueP = 0;
let IntvalueC = 0;
let playerCards = []
let comCards = []
let InttotalMoney = 1000;
let IntBetMoney = 100;
let canPlay = false;
let playerHasBJ = false;

const GameOutcome = {
    PLAYER_WIN: "player_win",
    DEALER_WIN: "dealer_win",
    DRAW: "draw"
};


const clickSound = document.getElementById("clickSound");
const foldSound = document.getElementById("foldSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const coinSound = document.getElementById("coinSound")
const volumeSlider = document.getElementById("volumeSlider");

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("bet");
    startButton.addEventListener("click", function () {
        if (canPlay == false) {
            coinSound.volume = volumeSlider.value;
            coinSound.play();

            if (InttotalMoney >= IntBetMoney) {
                InttotalMoney-=IntBetMoney;
                totalMoney.textContent = `${InttotalMoney}`;
                startGame();
                canPlay = true;
            } else {
                console.log("out of money!");
                canPlay = false;
            }
        }
    });

    const takeButton = document.getElementById("take");
    takeButton.addEventListener("click", function () {
        if (canPlay) {
            foldSound.volume = volumeSlider.value;
            foldSound.play();
            getCard();
        }
    });

    const stayButton = document.getElementById("stay");
    stayButton.addEventListener("click", function () {
        if (canPlay) {
            foldSound.volume = volumeSlider.value;
            foldSound.play();
            stay();
        }
    });
    const decreaseMoney = document.getElementById("decreaseMoney");
    decreaseMoney.addEventListener("click", function () {
        clickSound.volume = volumeSlider.value;
        clickSound.play();
        IntBetMoney -= 10;
        betMoney.textContent = `Bet ${IntBetMoney}€`;
    });
    const addMoney = document.getElementById("addMoney");
    addMoney.addEventListener("click", function () {
        clickSound.volume = volumeSlider.value;
        clickSound.play();
        IntBetMoney += 10;
        betMoney.textContent = `Bet ${IntBetMoney}€`;
    });
});

async function stay() {
    const cardBorderCom = document.getElementById("card-borderCom");

    if (cardBorderCom) { removeChildNodes(cardBorderCom); }

    reloadComCards();
    valueC.textContent = `${IntvalueC}`;

    if (IntvalueC === 21) {
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

    let outcome = null;

    if (IntvalueP === 21 && IntvalueC === 21) {
        outcome = GameOutcome.DEALER_WIN;
    } else if (IntvalueP === IntvalueC) {
        outcome = GameOutcome.DRAW;
    } else if (IntvalueC >= 17 && IntvalueC <= 21) {
        if (IntvalueP > IntvalueC || IntvalueC > 21) {
            outcome = GameOutcome.PLAYER_WIN;
        } else {
            outcome = GameOutcome.DEALER_WIN;
        }
    } else {
        if (IntvalueP > IntvalueC || IntvalueC > 21) {
            outcome = GameOutcome.PLAYER_WIN;
        } else {
            outcome = GameOutcome.DEALER_WIN;
        }
    }

    winCheck(outcome);
}



const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

function winCheck(outcome) {
    canPlay = false;

    switch (outcome) {
        case GameOutcome.DRAW:
            InttotalMoney += IntBetMoney;
            totalMoney.textContent = `${InttotalMoney}`;
            coinSound.volume = volumeSlider.value;
            coinSound.play();
            console.log("DRAW");
            break;
        case GameOutcome.PLAYER_WIN:
            winSound.volume = volumeSlider.value;
            winSound.play();
            if(playerHasBJ){
                InttotalMoney += IntBetMoney * 2.5;
            }else{
                InttotalMoney += IntBetMoney * 2;
            }
            
            totalMoney.textContent = `${InttotalMoney}`;
            console.log("WIN");
            break;
        case GameOutcome.DEALER_WIN:
            loseSound.volume = volumeSlider.value;
            loseSound.play();
            console.log("LOOSE");
            break;
    }
}


function startGame() {
    resetSlots();
    placeCardInSlot("P");
    placeCardInSlot("P");
    placeCardInSlot("C");
    placeCardInSlot("C", "startCards");

    if (IntvalueC == 21) {
        const cardBorderCom = document.getElementById("card-borderCom");
        if (cardBorderCom) { removeChildNodes(cardBorderCom); }
        reloadComCards();
        
        let outcome = GameOutcome.DEALER_WIN;
        
        winCheck(outcome);
    }
    if(IntvalueP == 21){
        valueP.textContent = "BlackJack!";
        playerHasBJ = true;
        console.log("PlayerHasBJ");
    }
}


function getCard() {
    placeCardInSlot("P");

    if (IntvalueP > 21) {
        let outcome = GameOutcome.DEALER_WIN;
        
        winCheck(outcome);
    }
}


function resetSlots() {
    IntvalueC = 0;
    IntvalueP = 0;
    playerCards = [];
    comCards = [];
    playerHasBJ = false;

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
