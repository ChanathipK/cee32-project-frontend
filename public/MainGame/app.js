import { draw, getParty, updateStat, getUser, endTurn, updateUserHand} from "./api.js"

var yourCards = [];

const attackBtn = document.getElementById('attack')
const interact = document.getElementById('interact')
const blockEPlayer = document.getElementById('blockEPlayer')
const block = document.getElementById('block')
const targetChoose = document.getElementById('targetChoose')
const playerCards = document.getElementById('playerCards')
const playerName = document.querySelectorAll('.player .playerName')
const enemyName = document.querySelectorAll('.ePlayer .playerName')

const userId = localStorage.getItem("userId");
const partyId = localStorage.getItem("partyId");

const party = await getParty(partyId);
var playable = false;

//stat = [hp,atk,def,hand]
var playerStats = [
    [20, 1, 0, 0], // player 1
    [20, 1, 0, 0],  // player 2
    [20, 1, 0, 0], // Enemy 1
    [20, 1, 0, 0]  // Enemy 2
];

//Death status
let isDead = []
for(let i = 0; i < 4; i++){
    isDead.push(false);
}

//// Init Game ////

let penetrate = false
var turnCounter = [0,0,0,0,0,0,0,0,0,0]; // count each remaining card effect time

// PlayersId is in this format
// [userId, Same team, Opponent, Opponent]
let playersId = [userId];
let Side=0;

// Find Player Turn && Assign value to playersId
let myTurn
for(let i = 0; i < 4; i++){
    if(party.users[i] == userId) myTurn = party.team[i];
    if(party.users[i] == userId && i < 2){
        Side = 0;
    }else if(party.users[i] == userId && i >= 2){
        Side = 2;
    }
}
for(let i = Side; i < Side + 2; i++){
    if(party.users[i] != userId) playersId.push(party.users[i])
}
for(let i = 0; i < 4; i++){
    if(playersId.indexOf(party.users[i]) == -1) playersId.push(party.users[i])
}

//assign username and display them
let username = []
for(let i = 0; i < 2; i++){
    let user = getUser(playersId[i])
    username.push(user.username)
    playerName[i].textContent = user.username
}
for(let i = 0; i < 2; i++){
    let user = getUser(playersId[i + 2])
    username.push(user.username)
    enemyName[i].textContent = user.username
}

let cardAmount = 0;

// for debugging only
myTurn = 1;

// Draw initial cards
for(let i = 0; i < 3; i++){
    await drawCard();
}

// Add click event to enemy player
const ePlayer = document.querySelectorAll('.ePlayer');
for(let i = 0; i < 2; i++){
    ePlayer[i].addEventListener("click", async (e) => {
        console.log(e);
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

//// Game logic ////

// Function call when turn start
function startTurn(){
    document.getElementById('attackText').textContent = 'Your turn';
    decreaseTurnCounter();
    // updateStatDisplay();
    attackBtn.addEventListener("click", attackPlayerPhase);
    playable = true;
}

// You can now attack enemy
function attackPlayerPhase() {
    attackBtn.disabled = true;
    document.getElementById('attackText').textContent = 'Choose a player to attack!!';
    block.style.display = 'inline'
    blockEPlayer.style.display = 'none'
    targetChoose.style.display = 'none'
}

function decreaseTurnCounter() {
    for (let i = 0; i < turnCounter.length; i++) {
        if (turnCounter[i] > 0) {
            turnCounter[i]--;
        }
    }
}

async function updateBackendStat(){
    for(let i = 0; i < 4; i++){
        await updateStat(playersId[i], {
            "attack": playerStats[i][1],
            "defence": playerStats[i][2],
            "hp": playerStats[i][0],
        })
    }
}

async function endUserTurn(){
    //disable attack button
    document.getElementById('attackText').textContent = 'Please wait...';
    attackBtn.removeEventListener("click", attackPlayer);
    await endTurn()
    playable = false;
}

//disable enemy button
function removeClickEvent(){
    blockEPlayer.style.display = 'inline'
}

function doDamage(targetIndex){
    // Calculate the damage to the targeted enemy
    var damage = Math.max(playerStats[0][1] - playerStats[targetIndex][2], 0);
    if(penetrate) {
        damage = playerStats[0][1];
        penetrate = false;
    }
    playerStats[targetIndex][0] -= damage;
    if(playerStats[targetIndex][0] <= 0){
        playerStats[targetIndex][0] = 0;
        isDead[targetIndex] = true;
    }
    document.getElementById('attackText').textContent = damage+' damage(s) dealt!';
    console.log(document.getElementById('attackText').textContent);
    // Update the targeted enemy's health
    updateStatDisplay();
    updateBackendStat()
}

function addCard() {
    var newCard = document.createElement('div');
    newCard.classList.add('card');
    playerCards.appendChild(newCard);

    return newCard;
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
// (penetrate 1 time):  10, 10 cards
function useCardOn(cardId, playerId, card) {
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
    targetChoose.style.display = 'none'
    card.remove()
    updateStatDisplay();
    updateBackendStat();
    endUserTurn()
}


function attBuff(playerIndex,amount){
    playerStats[playerIndex][1]+=amount;
}
function attNerf(playerIndex,amount){
    playerStats[playerIndex][1]-=amount;
    if(playerStats[playerIndex][1] < 0) playerStats[playerIndex][1] = 0;
}
function defBuff(playerIndex,amount){
    playerStats[playerIndex][2]+=amount;
}
function defNerf(playerIndex,amount){
    playerStats[playerIndex][2]-=amount;
    if(playerStats[playerIndex][2] < 0) playerStats[playerIndex][2] = 0;
}

//// Helper Functions ////

// Fetch each users and update stat (display)
async function getStatUpdate(){
    for(let i = 0; i < 4; i++){
        let user = await getUser(playersId[i])
        playerStats[i][0] = user.hp;
        playerStats[i][1] = user.attack;
        playerStats[i][2] = user.defence;
        playerStats[i][3] = user.hand;
    }
    updateStatDisplay()
}

// Check if this is your turn
async function fetchTurn(){
    let tParty = await getParty(partyId);
    if(tParty.turn == myTurn && !playable){
        startTurn()
        playable = true;
    }
}

// Update Stat Display
const playerHealthElements = document.querySelectorAll('.player .health');
const enemyHealthElements = document.querySelectorAll('.ePlayer .health');
const playerAtkElements = document.querySelectorAll('.player .atk');
const enemyAtkElements = document.querySelectorAll('.ePlayer .atk');
const playerDefElements = document.querySelectorAll('.player .def');
const enemyDefElements = document.querySelectorAll('.ePlayer .def');
const playerHand = document.querySelectorAll('.player .hand');
const enemyHand = document.querySelectorAll('.ePlayer .hand');
function updateStatDisplay() {
    // Update player health display
    playerHealthElements.forEach((element, index) => {
        element.textContent = playerStats[index][0];
    });
    // Update enemy health display
    enemyHealthElements.forEach((element, index) => {
        element.textContent = playerStats[index + 2][0];
    });

    //Update attack
    playerAtkElements.forEach((element, index) => {
        element.textContent = playerStats[index][1];
    });
    enemyAtkElements.forEach((element, index) => {
        element.textContent = playerStats[index + 2][1];
    });

    //Update defence
    playerDefElements.forEach((element, index) => {
        element.textContent = playerStats[index][2];
    });
    enemyDefElements.forEach((element, index) => {
        element.textContent = playerStats[index + 2][2];
    });

    //Update hand
    playerHand.forEach((element, index) => {
        element.textContent = playerStats[index][3];
    });
    enemyHand.forEach((element, index) => {
        element.textContent = playerStats[index + 2][3];
    });
}

// Draw card and update data to db
async function drawCard() {
    if(cardAmount < 5){
        let cardId = await draw();
        yourCards.push(cardId);
        var newCard = addCard();
        if(cardId == 1){
            newCard.innerText = "+1 atk for 3 turns";
        }
        if(cardId == 2){
            newCard.innerText = "+2 atk for 2 turns";
        }
        if(cardId == 3){
            newCard.innerText = "+1 atk permanently";
        }
        if(cardId == 4){
            newCard.innerText = "-1 atk for 2 turns";
        }
        if(cardId == 5){
            newCard.innerText = "+1 def for 3 turns";
        }
        if(cardId == 6){
            newCard.innerText = "+2 def for 2 turns";
        }
        if(cardId == 7){
            newCard.innerText = "+1 def permanently";
        }
        if(cardId == 8){
            newCard.innerText = "-1 def for 2 turns";
        }
        if(cardId == 9){
            newCard.innerText = "skip target turn 1 time";
        }
        if(cardId == 10){
            newCard.innerText = "damage denies defence 1 time";
        }
        newCard.addEventListener('click', () => {
            document.getElementById('attackText').textContent = 'Choose a target!';
            block.style.display = 'inline';
            for(let i = 0; i < 4; i++){
                let button = document.createElement('button')
                button.classList.add('target')
                button.textContent = username[i];
                button.addEventListener(useCardOn(cardId, playersId[i], this))
                targetChoose.appendChild(button)
            }
            this.style.border = '5px'
            playerCards.array.forEach(element => {
                if(element !== this){
                    element.style.border = '0';
                }
            });
        })
        cardAmount += 1;
        playerStats[0][3] += 1;
        updateUserHand(1);
    }
}