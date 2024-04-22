import { draw, getCards } from "./api.js"

var yourCards = [];
var cardAmount = 3;

const attack = document.getElementById('attack')
const interact = document.getElementById('interact')
const ePlayer = document.querySelectorAll('.ePlayer');
const blockEPlayer = document.getElementById('blockEPlayer')
const block = document.getElementById('block')
const playerHealthElements = document.querySelectorAll('.player .health');
const enemyHealthElements = document.querySelectorAll('.ePlayer .health');

const userId = localStorage.getItem("userId");
const partyId = localStorage.getItem("partyId");

var playable = false;
//stat = [hp,atk,def]
var playerStats = [
    [20, 1, 0], // player 1
    [20, 1, 0]  // player 2
];
var enemyStats = [
    [20, 1, 0], // Enemy 1
    [20, 1, 0]  // Enemy 2
];

let penetrate = false

var turnCounter = [0,0,0,0,0,0,0,0,0,0]; // count each remaining card effect time

for(let i = 0; i < 3; i++){
    drawCard()
}

for(let i = 0; i < 2; i++){
    ePlayer[i].addEventListener("click", async () => {
        doDamage(i);
        attack.disabled = false;
        //document.getElementById('attackText').textContent = '';
        block.style.display = 'none';
        await drawCard();
        removeClickEvent()
        endTurn();
    });
}

function decreaseTurnCounter() {
    for (let i = 0; i < turnCounter.length; i++) {
        if (turnCounter[i] > 0) {
            turnCounter[i]--;
        }
    }
}

//function call when turn start
function startTurn(){
    document.getElementById('attackText').textContent = 'Your turn';
    decreaseTurnCounter();
    updateStatDisplay(playerStats, enemyStats);
    attack.addEventListener("click", attackPlayer);
    playable = true;
}

async function fetchTurn(){
    //TODO
}

function endTurn(){
    //disable attack button
    document.getElementById('attackText').textContent = 'Please wait...';
    attack.removeEventListener("click", attackPlayer);
    playable = false;

    // implement when to start
    if (0===0) {
        startTurn()
    }
}


if (0===0) {startTurn()}

if (playable) {
    attack.addEventListener("click", attackPlayer);
}
else {attack.removeEventListener("click", attackPlayer);}

//enable enemy button
function attackPlayer() {
    attack.disabled = true
    document.getElementById('attackText').textContent = 'Choose a player to attack!!';
    block.style.display = 'inline'
    blockEPlayer.style.display = 'none'
}

//disable enemy button
function removeClickEvent(){
    blockEPlayer.style.display = 'inline'
}

function doDamage(targetIndex){
    // Calculate the damage to the targeted enemy
    var damage = Math.max(playerStats[0][1] - enemyStats[targetIndex][2], 0);
    if(penetrate) damage = playerStats[0][1];
    enemyStats[targetIndex][0] -= damage;
    document.getElementById('attackText').textContent = damage+' damage(s) dealt!';
    console.log(document.getElementById('attackText').textContent);
    // Update the targeted enemy's health
    updateStatDisplay(playerStats, enemyStats);
}


async function drawCard() {
    if(cardAmount < 5){
        let cardNumber = await draw();
        yourCards.push(cardNumber);
        var newCard = addCard();
        newCard.innerText = cardNumber;
        cardAmount += 1;
    }
}

function addCard() {
    var newCard = document.createElement('div');
    newCard.classList.add('card');
    playerCards.appendChild(newCard);

    return newCard;
}

function updateStatDisplay(playerStats, enemyStats) {
    // Update player health display
    playerHealthElements.forEach((element, index) => {
        element.textContent = playerStats[index][0];
    });

    // Update enemy health display
    enemyHealthElements.forEach((element, index) => {
        element.textContent = enemyStats[index][0];
    });
}


// card info
// (+1 atk for 3 turns): 1,  20 cards
// (+2 atk for 2 turns): 2,  10 cards
// (+1 atk permanent):   3,  5  cards
// (-1 atk for 2 turns): 4,  15 cards
// (+1 def for 3 turns): 5,  12 cards
// (+2 def for 2 turns): 6,  6  cards
// (+1 def permanent):   7,  3  cards
// (-1 def for 2 turns): 8,  9  cards
// (skip target 1 turn): 9,  10 cards
// (penertrate 1 time):  10, 10 cards
function useCard(id, playerId) {
    if(id == 1){
        attBuff(playerId, 1)
    }
    if(id == 2){
        attBuff(playerId, 2)
    }
    if(id == 3){
        attBuff(playerId, 1)
    }
    if(id == 4){
        attNerf(playerId, 1)
    }
    if(id == 5){
        defBuff(playerId, 1)
    }
    if(id == 6){
        defBuff(playerId, 2)
    }
    if(id == 7){
        defBuff(playerId, 1)
    }
    if(id == 8){
        defNerf(playerId, 1)
    }
    if(id == 9){
        //TODO
    }
    if(id == 10){
        //TODO
    }
}


function attBuff(playerIndex,amount){
    playerStats[playerIndex][1]+=amount;
    updateStatDisplay(playerStats, enemyStats);
}
function attNerf(enemyIndex,amount){
    enemyStats[enemyIndex][1]-=amount;
    if(enemyStats[enemyIndex][1] < 0) enemyStats[enemyIndex][1] = 0;
    updateStatDisplay(playerStats, enemyStats);
}
function defBuff(playerIndex,amount){
    playerStats[playerIndex][2]+=amount;
    updateStatDisplay(playerStats, enemyStats);
}
function defNerf(enemyIndex,amount){
    enemyStats[enemyIndex][2]-=amount;
    if(enemyStats[enemyIndex][2] < 0) enemyStats[enemyIndex][2] = 0;
    updateStatDisplay(playerStats, enemyStats);
}
