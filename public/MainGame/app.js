import { draw, getParty, updateStat, getUser, endTurn, updateUserHand, attack} from "./api.js"

var yourCards = [];

const attackText = document.getElementById('attackText');
const attackBtn = document.getElementById('attack');
const blockEPlayer = document.getElementById('blockEPlayer');
const block = document.getElementById('block');
const targetChoose = document.getElementById('targetChoose');

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
let usernames = [];
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

// Fetch usernames
for(let i=0;i<4;i++){
    const user = await getUser(playersId[i]);
    usernames[i] = user.username;
}

// Target Choose
for(let i=0;i<4;i++){
    const button = document.createElement('button');
    button.classList.add('target');
    button.textContent = usernames[i];
    targetChoose.appendChild(button);
}
targetChoose.style.display = 'none';

// This value change every time drawCard is called
let cardAmount = 0;

// Draw initial cards
for(let i = 0; i < 1; i++){
    await drawCard();
}

// Show user name
updateNameDisplay();

// Add event to attack button
attackBtn.addEventListener("click", attackPlayerPhase);

// Add click event to enemy player
const ePlayer = document.querySelectorAll('.ePlayer');
for(let i = 0; i < 2; i++){
    ePlayer[i].addEventListener("click", async (e) => {
        doDamage(i);

        attackBtn.disabled = false;
        block.style.display = 'none';
        
        await drawCard();
        
        removeClickEvent();
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
    attackText.textContent = 'Your turn';
    // decreaseTurnCounter();
    // updateStatDisplay();
    block.style.display = 'none';
    attackBtn.disabled = false;
    playable = true;
}

function attackPlayerPhase() {
    targetChoose.style.display = 'none';
    attackBtn.disabled = true;
    attackText.textContent = 'Choose a player to attack!!';
    block.style.display = 'inline'
    blockEPlayer.style.display = 'none'
}

function useCardPhase() {
    targetChoose.style.display = 'flex';
    attackBtn.disabled = true;
    attackText.textContent = 'Choose a target!';
    block.style.display = 'inline';
}

// Deal damage to target
async function doDamage(targetIndex){
    // Calculate the damage to the targeted enemy
    let damage = Math.max(playerStats[0][1] - enemyStats[targetIndex][2], 0);
    if(penetrate) damage = playerStats[0][1];
    // Display message
    attackText.textContent = damage+' damage(s) dealt!';
    // Call backend
    const response = await attack(playersId[targetIndex+2],true);
    if(response.isTargetDead)
        attackText.textContent = 'You have killed enemy';
    // Get stats updated
    await getStatUpdate();
}

// End user turn
async function endUserTurn(){
    attackBtn.disabled = true;
    attackText.textContent = 'Please wait...';
    await endTurn();
    playable = false;
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
function useCardOn(playerId,cardId) {
    console.log(`Player: ${userId} used card ${cardId} on ${playerId}`);    
    // if(cardId == 1){
    //     attBuff(playerId, 1)
    // }
    // if(cardId == 2){
    //     attBuff(playerId, 2)
    // }
    // if(cardId == 3){
    //     attBuff(playerId, 1)
    // }
    // if(cardId == 4){
    //     attNerf(playerId, 1)
    // }
    // if(cardId == 5){
    //     defBuff(playerId, 1)
    // }
    // if(cardId == 6){
    //     defBuff(playerId, 2)
    // }
    // if(cardId == 7){
    //     defBuff(playerId, 1)
    // }
    // if(cardId == 8){
    //     defNerf(playerId, 1)
    // }
    // if(cardId == 9){
    //     //TODO
    // }
    // if(cardId == 10){
    //     //TODO
    // }
    // updateStatDisplay();
    // updateBackendStat();
    endUserTurn();
}

//// To be organized ////

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
    updatePartyInfo(tParty);
    if(tParty.turn == myTurn && !playable){
        startTurn()
        playable = true;
    }
    else if(tParty.turn != myTurn){
        attackText.textContent="Please wait...";
        block.style.display = "inline";
        attackBtn.disabled = true;
    }
}

// Update Name Display
function updateNameDisplay(){
    const playerName = document.querySelectorAll(".player h3");
    const enemyName = document.querySelectorAll(".ePlayer h3");
    // Update name
    playerName.forEach((element,index) => {
        element.textContent = usernames[index];
    });
    enemyName.forEach( (element,index) => {
        element.textContent = usernames[index+2];
    });
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
    // Update health
    playerHealthElements.forEach((element, index) => {
        element.textContent = playerStats[index][0];
    });
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
    const tUser = await getUser(userId);
    cardAmount = tUser.hand;
    if(cardAmount < 5 || true){
        let cardId = await draw();
        yourCards.push(cardId);
        let newCard = addCard(cardId);
        document.getElementById('playerCards').appendChild(newCard);
        cardAmount += 1;
        playerStats[0][3] += 1;
        updateUserHand(1);
    }
}

// Disable click event
function removeClickEvent(){
    blockEPlayer.style.display = 'inline'
}

// Create new card (div)
function addCard(cardId) {
    let newCard = document.createElement('div');
    newCard.classList.add('card');
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
    newCard.addEventListener('click', async (e) => {
        useCardPhase();
        const targets = document.querySelectorAll(".target");
        for(let i=0;i<4;i++){
            targets[i].addEventListener('click',function handleClick(){
                useCardOn(playersId[i],cardId);
                targetChoose.style.display = 'none';

                targets[i].removeEventListener('click',handleClick);
            });
        }
        e.target.remove();
        await updateUserHand(-1);
    })
    return newCard;
}

const partyInfoRound = document.getElementById("party-info-round");
const partyInfoTurn = document.getElementById("party-info-turn");
function updatePartyInfo(party){
    partyInfoRound.innerHTML = `Round ${party.round}`;
    partyInfoTurn.innerHTML = `Turn ${party.turn}`;
}