import { draw, getParty, updateStat, getUser, endTurn} from "./api.js"

var yourCards = [];
var cardAmount = 3;

const attackBtn = document.getElementById('attack')
const interact = document.getElementById('interact')
const ePlayer = document.querySelectorAll('.ePlayer');
const blockEPlayer = document.getElementById('blockEPlayer')
const block = document.getElementById('block')
const playerHealthElements = document.querySelectorAll('.player .health');
const enemyHealthElements = document.querySelectorAll('.ePlayer .health');
const playerAtkElements = document.querySelectorAll('.player .atk');
const enemyAtkElements = document.querySelectorAll('.ePlayer .atk');
const playerDefElements = document.querySelectorAll('.player .def');
const enemyDefElements = document.querySelectorAll('.ePlayer .def');
const playerHand = document.querySelectorAll('.player .hand');
const enemyHand = document.querySelectorAll('.ePlayer .hand');

const userId = localStorage.getItem("userId");
const partyId = localStorage.getItem("partyId");

const party = await getParty(partyId)
var playable = false;
//stat = [hp,atk,def]
var playerStats = [
    [20, 1, 0, 0], // player 1
    [20, 1, 0, 0]  // player 2
];
var enemyStats = [
    [20, 1, 0, 0], // Enemy 1
    [20, 1, 0, 0]  // Enemy 2
];

//assign player's ID
let playersId = [userId];
let n;
let myTurn
for(let i = 0; i < 4; i++){
    if(party.users[i] == userId) myTurn = party.team[i];
    if(party.users[i] == userId && i < 2){
        n = 0;
    }else if(party.users[i] == userId && i >= 2){
        n = 2;
    }
}
for(let i = n; i < n + 2; i++){
    if(party.users[i] != userId) playersId.push(party.users[i])
}
for(let i = 0; i < 4; i++){
    if(playersId.indexOf(party.users[i]) != -1) playersId.push(party.users[i])
}
// playersId [userId,user's team,enemy,enemy]

let penetrate = false

var turnCounter = [0,0,0,0,0,0,0,0,0,0]; // count each remaining card effect time

for(let i = 0; i < 3; i++){
    await drawCard()
}

for(let i = 0; i < 2; i++){
    ePlayer[i].addEventListener("click", async () => {
        doDamage(i);
        attackBtn.disabled = false;
        //document.getElementById('attackText').textContent = '';
        block.style.display = 'none';
        await drawCard();
        removeClickEvent()
        endUserTurn();
    });
}

//update stat every 0.5s
setInterval(getStatUpdate, 500)
//fetch turn every 0.5s
setInterval(fetchTurn, 500)

function decreaseTurnCounter() {
    for (let i = 0; i < turnCounter.length; i++) {
        if (turnCounter[i] > 0) {
            turnCounter[i]--;
        }
    }
}

async function updateBackendStat(){
    for(let i = 0; i < 2; i++){
        await updateStat(playersId[i], {
            "attack": playerStats[1],
            "defence": playerStats[2],
            "hp": playerStats[0],
            "hand": playerStats[3]
        })
    }
    for(let i = 0; i < 2; i++){
        await updateStat(playersId[i + 2], {
            "attack": enemyStats[1],
            "defence": enemyStats[2],
            "hp": enemyStats[0],
            "hand": enemyStats[3]
        })
    }
}

async function getStatUpdate(){
    for(let i = 0; i < 2; i++){
        let user = getUser(playersId[i])
        playerStats[i][0] = user.health;
        playerStats[i][1] = user.attack;
        playerStats[i][2] = user.defence;
        playerStats[i][3] = user.hand;
    }
    for(let i = 0; i < 2; i++){
        let user = getUser(playersId[i + 2])
        enemyStats[i][0] = user.health;
        enemyStats[i][1] = user.attack;
        enemyStats[i][2] = user.defence;
        enemyStats[i][3] = user.hand;
    }
    updateStatDisplay()
}

//function call when turn start
function startTurn(){
    document.getElementById('attackText').textContent = 'Your turn';
    decreaseTurnCounter();
    updateStatDisplay();
    attackBtn.addEventListener("click", attackPlayer);
    playable = true;
}

async function fetchTurn(){
    let tParty = getParty(partyId)
    if(tParty.turn == myTurn && !playable){
        startTurn()
        playable = true
    }
}

async function endUserTurn(){
    //disable attack button
    document.getElementById('attackText').textContent = 'Please wait...';
    attackBtn.removeEventListener("click", attackPlayer);
    await endTurn()
    playable = false;
}

//enable enemy button
function attackPlayer() {
    attackBtn.disabled = true
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
    updateStatDisplay();
    updateBackendStat()
}


async function drawCard() {
    if(cardAmount < 5){
        let cardNumber = await draw();
        yourCards.push(cardNumber);
        var newCard = addCard();
        newCard.innerText = cardNumber;
        cardAmount += 1;
        playerStats[0][3] += 1;
        updateBackendStat()
    }
}

function addCard() {
    var newCard = document.createElement('div');
    newCard.classList.add('card');
    playerCards.appendChild(newCard);

    return newCard;
}

function updateStatDisplay() {
    // Update player health display
    playerHealthElements.forEach((element, index) => {
        element.textContent = playerStats[index][0];
    });
    // Update enemy health display
    enemyHealthElements.forEach((element, index) => {
        element.textContent = enemyStats[index][0];
    });

    //Update attack
    playerAtkElements.forEach((element, index) => {
        element.textContent = playerStats[index][1];
    });
    enemyAtkElements.forEach((element, index) => {
        element.textContent = enemyStats[index][1];
    });

    //Update defence
    playerDefElements.forEach((element, index) => {
        element.textContent = playerStats[index][2];
    });
    enemyDefElements.forEach((element, index) => {
        element.textContent = enemyStats[index][2];
    });

    //Update hand
    playerHand.forEach((element, index) => {
        element.textContent = playerStats[index][3];
    });
    enemyHand.forEach((element, index) => {
        element.textContent = enemyStats[index][3];
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
function useCardOn(cardId, playerId) {
    if(cardId == 1){
        attBuff(playerId, 1)
    }
    if(cardId == 2){
        attBuff(playerId, 2)
    }
    if(cardId == 3){
        attBuff(playerId, 1)
    }
    if(cardId == 4){
        attNerf(playerId, 1)
    }
    if(cardId == 5){
        defBuff(playerId, 1)
    }
    if(cardId == 6){
        defBuff(playerId, 2)
    }
    if(cardId == 7){
        defBuff(playerId, 1)
    }
    if(cardId == 8){
        defNerf(playerId, 1)
    }
    if(cardId == 9){
        //TODO
    }
    if(cardId == 10){
        //TODO
    }
    updateStatDisplay();
    updateBackendStat();
    endUserTurn()
}


function attBuff(playerIndex,amount){
    playerStats[playerIndex][1]+=amount;
}
function attNerf(enemyIndex,amount){
    enemyStats[enemyIndex][1]-=amount;
    if(enemyStats[enemyIndex][1] < 0) enemyStats[enemyIndex][1] = 0;
}
function defBuff(playerIndex,amount){
    playerStats[playerIndex][2]+=amount;
}
function defNerf(enemyIndex,amount){
    enemyStats[enemyIndex][2]-=amount;
    if(enemyStats[enemyIndex][2] < 0) enemyStats[enemyIndex][2] = 0;
}
