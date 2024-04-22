import { playCard } from "./api";

var deck = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var yourCards = [];
var cardAmount = 2;

const attack = document.getElementById('attack')
const playcard = document.getElementById('playCard')
const playerCards = document.querySelectorAll('.ePlayer');
const interact = document.getElementById('interact')
const ePlayer = document.querySelectorAll('.ePlayer');
const player = document.querySelectorAll('.player');
const block = document.getElementById('block')
const playerHealthElements = document.querySelectorAll('.player .health');
const playerAtkElements = document.querySelectorAll('.player .atk');
const playerDefElements = document.querySelectorAll('.player .def');
const enemyHealthElements = document.querySelectorAll('.ePlayer .health');
const enemyAtkElements = document.querySelectorAll('.ePlayer .atk');
const enemyDefElements = document.querySelectorAll('.ePlayer .def');

var playable = false;

//stat = [hp,atk,def]
var playerStats = [
    [20, 1, 0], // player 1
    [20, 1, 0]  // Enemy 2
];
var enemyStats = [
    [20, 1, 0], // Enemy 1
    [20, 1, 0]  // Enemy 2
];

var turnCounter = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]; // count each remaining card effect time

function decreaseTurnCounter() {
    for (let i = 0; i < turnCounter.length; i++) {
        for (let j = 0; j < turnCounter[i].length; j++) {
            if (turnCounter[i][j] > 0) {
                turnCounter[i][j]--;
                if (turnCounter[i][j]===0) {
                    removeBuff(i,j);
                }
            }
        }
    }
}


//function call when turn start
function startTurn(){
    document.getElementById('attackText').textContent = 'Your turn';
    decreaseTurnCounter();
    updateStatDisplay(playerStats, enemyStats);
    attack.addEventListener("click", attackPlayer);
    playcard.addEventListener("click", playCard);
    playable = true;
}

function endTurn(){
    //disable attack button
    document.getElementById('attackText').textContent = 'Please wait...';
    attack.removeEventListener("click", attackPlayer);
    playcard.removeEventListener("click", playCard);
    playable = false;

    // implement when to start
    if (0===0) {
        startTurn()
    }
}


function attackPlayer() {
    attack.disabled = true
    document.getElementById('attackText').textContent = 'Choose a player to attack!!';
    block.style.display = 'inline'

    // Define a named function for the event listener
    function handleClick() {
        var targetIndex = Array.from(ePlayer).indexOf(event.currentTarget);
        console.log(targetIndex)
        doDamage(targetIndex);
        console.log("do");
        attack.disabled = false;
        //document.getElementById('attackText').textContent = '';
        block.style.display = 'none'
        draw();
        removeClickEvent()
    }
    
    function removeClickEvent(){
        ePlayer.forEach(el => {
            el.removeEventListener('click', handleClick);
        });
    }
    // Add event listeners to each enemy player
    ePlayer.forEach(element => {
        element.addEventListener("click", handleClick);
    });
}



function doDamage(targetIndex){
    
    //To be impliment

    // Calculate the damage to the targeted enemy
    var damage = Math.max(playerStats[0][1] - enemyStats[targetIndex][2], 0);
    enemyStats[targetIndex][0] -= damage;
    document.getElementById('attackText').textContent = damage+' damage(s) dealt!';
    console.log(document.getElementById('attackText').textContent);
    // Update the targeted enemy's health
    updateStatDisplay(playerStats, enemyStats);
}


function draw() {
    if(cardAmount < 5){
        let cardIndex = Math.floor(Math.random() * deck.length);
        let cardInfo = deck.splice(cardIndex, 1)[0];
        yourCards.push(cardInfo);

        var newCard = addCard();
        newCard.innerText = cardInfo;
        cardAmount += 1;
        endTurn();
    }
}

function addCard() {
    console.log('draw')
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
    playerAtkElements.forEach((element, index) => {
        element.textContent = playerStats[index][1];
    });
    playerDefElements.forEach((element, index) => {
        element.textContent = playerStats[index][2];
    });
    // Update enemy health display
    enemyHealthElements.forEach((element, index) => {
        element.textContent = enemyStats[index][0];
    });
    enemyAtkElements.forEach((element, index) => {
        element.textContent = enemyStats[index][1];
    });
    enemyDefElements.forEach((element, index) => {
        element.textContent = enemyStats[index][2];
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
function playCard() {
    playcard.disabled = true;
    document.getElementById('attackText').textContent = 'Choose the card to play!!';
    block.style.display = 'inline';

    // Define a named function for the event listener
    function handleCardClick() {
        var cardIndex = Array.from(playerCards).indexOf(event.currentTarget);
        document.getElementById('attackText').textContent = 'Choose the target!!';
        
        // Define a named function for the target selection event listener
        function handleTargetClick() {
            var targetIndex = Array.from(ePlayer).indexOf(event.currentTarget);
            console.log(cardIndex);
            console.log(targetIndex);
            console.log("play");
            useCard(cardIndex, targetIndex);
            playcard.disabled = false;
            block.style.display = 'none';
            removeClickEvent();
        }

        block.style.display = 'none';
        removeClickEvent();
    }
    
    function removeClickEvent(){
        ePlayer.forEach(el => {
            el.removeEventListener('click', handleCardClick);
        });
    }
    // Add event listeners to each enemy player
    ePlayer.forEach(element => {
        element.addEventListener("click", handleCardClick);
    });
}

function attBuff(playerIndex,amount){
    playerStats[playerIndex][1]+=amount;
    updateStatDisplay(playerStats, enemyStats);
}
function attNerf(enemyIndex,amount){
    enemyStats[enemyIndex][1]-=amount;
    updateStatDisplay(playerStats, enemyStats);
}
function defBuff(playerIndex,amount){
    playerStats[playerIndex][2]+=amount;
    updateStatDisplay(playerStats, enemyStats);
}
function defNerf(enemyIndex,amount){
    enemyStats[enemyIndex][2]-=amount;
    updateStatDisplay(playerStats, enemyStats);
}

function doCardEffect(i,playerIndex){
    if (i===0) {
        attBuff(playerIndex,1);
        turnCounter[0].add(3);
    }
    if (i===1) {
        attBuff(playerIndex,2);
        turnCounter[1].add(2);
    }
    if (i===2) {
        attBuff(playerIndex,1);
        turnCounter[2].add(-1);
    }
    if (i===3) {
        attNerf(playerIndex,1);
        turnCounter[3].add(2);
    }
    if (i===4) {
        attBuff(playerIndex,1);
        turnCounter[0].add(3);
    }
    if (i===5) {
        defBuff(playerIndex,2);
        turnCounter[5].add(2);
    }
    if (i===6) {
        defBuff(playerIndex,1);
        turnCounter[6].add(-1);
    }
    if (i===7) {
        defNerf(playerIndex,1);
        turnCounter[7].add(2);
    }
}
function removeBuff(i,j,playerIndex){
    if (i===0) {
        attBuff(playerIndex,-1);
        turnCounter[0].pop(j);
    }
    if (i===1) {
        attBuff(playerIndex,-2);
        turnCounter[1].pop(j);
    }
    if (i===2) {
        attBuff(playerIndex,-1);
        turnCounter[2].pop(j);
    }
    if (i===3) {
        attNerf(playerIndex,-1);
        turnCounter[3].pop(j);
    }
    if (i===4) {
        attBuff(playerIndex,-1);
        turnCounter[0].pop(j);
    }
    if (i===5) {
        defBuff(playerIndex,-2);
        turnCounter[5].pop(j);
    }
    if (i===6) {
        defBuff(playerIndex,-1);
        turnCounter[6].pop(j);
    }
    if (i===7) {
        defNerf(playerIndex,-1);
        turnCounter[7].pop(j);
    }
}

function useCard(id,playerIndex) {
    doCardEffect(id,playerIndex);
}