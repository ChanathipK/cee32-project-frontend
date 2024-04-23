import { draw, getParty, updateStat, getUser, endTurn, updateUserHand, attack, endGame} from "./api.js"

var yourCards = [];

const attackText = document.getElementById('attackText');
const attackBtn = document.getElementById('attack');
const blockEPlayer = document.getElementById('blockEPlayer');
const block = document.getElementById('block');
const targetChoose = document.getElementById('targetChoose');

const userId = localStorage.getItem("userId");
const partyId = localStorage.getItem("partyId");

// Handle case that user don't have data in Localstorage
if(!userId){
    location.replace("http://107.20.74.210:3221")
}
if(!partyId){
    location.replace("http://107.20.74.210:3221/party")
}

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
const player = document.querySelectorAll('.player')
const eventListeners = [];
for (let i = 0; i < 2; i++) {
    const handleClick = async (index) => {
        doDamage(index);
        attackBtn.disabled = false;
        block.style.display = 'none';
        await drawCard();
        removeClickEvent();
        endUserTurn();
    };
    // Add event listener using the arrow function
    ePlayer[i].addEventListener("click", handleClick.bind(null, i));

    // Store reference to the arrow function
    eventListeners.push(handleClick.bind(null, i));
}

//update stat every 0.5s
setInterval(getStatUpdate, 500)
//fetch turn every 0.5s
setInterval(fetchTurn, 500)


//// Game logic ////

// Function call when turn start
function startTurn(){
    if(playerStats[0][0] == 0) endTurn()
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
    let damage = Math.max(playerStats[0][1] - playerStats[targetIndex + 2][2], 0);
    if(penetrate) damage = playerStats[0][1];
    // Display message
    attackText.textContent = damage+' damage(s) dealt!';
    // Call backend
    const response = await attack(playersId[targetIndex+2],true);
    if(response.isTargetDead)
        attackText.textContent = 'You have killed enemy';
    // Get stats updated
    await getStatUpdate();
    await updateBackendStat()
}

// End user turn
async function endUserTurn(){
    attackBtn.disabled = true;
    attackText.textContent = 'Please wait...';
    await endTurn();
    playable = false;
}

// ca5d info
// (+1  atk)              : 1,  20 cards
// (+2  atk -2 hp)        : 2,  10 cards
// (+3  atk -3 hp)        : 3,  5  cards
// (+4  hp)               : 4,  15 cards
// (+1  def +1 hp)        : 5,  12 cards
// (+4  def -2 atk)       : 6,  6  cards
// (+15 hp  -2 atk -2 def): 7,  3  cards
// (-3  def)              : 8,  9  cards
// (+7  hp  -2 atk)       : 9,  10 cards
// (draw 2)               : 10, 10 cards
function useCardOn(playerId,cardId) {
    console.log(`Player: ${userId} used card ${cardId} on ${playerId}`);    
    if(cardId == 1){
        attBuff(playerId, 1)
    }
    if(cardId == 2){
        attBuff(playerId, 2)
        healthAdjust(playerId, -2)
    }
    if(cardId == 3){
        attBuff(playerId, 3)
        healthAdjust(playerId, -3)
    }
    if(cardId == 4){
        healthAdjust(playerId, 4)
    }
    if(cardId == 5){
        defBuff(playerId, 1)
        healthAdjust(playerId, 1)
    }
    if(cardId == 6){
        defBuff(playerId, 4)
        attNerf(playerId, 2)
        
    }
    if(cardId == 7){
        healthAdjust(playerId, 15)
        defNerf(playerId, 2)
        attNerf(playerId, 2)
    }
    if(cardId == 8){
        defNerf(playerId, 3)
    }
    if(cardId == 9){
        healthAdjust(playerId,7)
        attNerf(playerId,2)
    }
    if(cardId == 10){
        drawCard()
        drawCard()
    }
    updateStatDisplay();
    updateBackendStat();
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
            "hp": playerStats[i][0]
        })
    }
}
function healthAdjust(playerIndex,amount){
    playerStats[playerIndex][0] += amount;
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
    let deathCount1 = 0;
    let deathCount2 = 0;
    for(let i = 0; i < 4; i++){
        let user = await getUser(playersId[i])
        playerStats[i][0] = user.hp;
        playerStats[i][1] = user.attack;
        playerStats[i][2] = user.defence;
        playerStats[i][3] = user.hand;
        if(playerStats[i][0] == 0 && !isDead[i]){
            isDead[i] = true;
            if(i > 1){
                deathCount2 += 1
                ePlayer[i - 2].removeEventListener("click", eventListeners[i - 2]);
                while(ePlayer[i - 2].firstChild){
                    ePlayer[i - 2].removeChild(ePlayer[i].firstChild)
                }
                const text = document.createElement("h1")
                text.textContent = "DEAD"
                ePlayer.appendChild(text)
            }
            else{
                deathCount1 += 1
                player[i].removeEventListener("click", eventListeners[i]);
                while(player[i].firstChild){
                    player[i].removeChild(player[i].firstChild)
                }
                const text = document.createElement("h1")
                text.textContent = "DEAD"
                player.appendChild(text)
            }
            targetChoose[i].style.display = 'none'
        }
    }
    if(deathCount1 == 2 || deathCount2 == 2){
        if(deathCount1 == 2){
            attackText.textContent = `${usernames[2]} and ${usernames[3]} wins!!`
        }
        if(deathCount2 == 2){
            attackText.textContent = `${usernames[0]} and ${usernames[1]} wins!!`
        }
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
        endGame()
        localStorage.removeItem('partyId')
        location.replace("http://107.20.74.210:3221/party")
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
    console.log(playerName);
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
    if(cardAmount < 5){
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
        newCard.innerText = "Increase 1 ATK";
    }
    if(cardId == 2){
        newCard.innerText = "Increase 2 ATK while decrease 2 HP";
    }
    if(cardId == 3){
        newCard.innerText = "Increase 3 ATK while decrease 3 HP";
    }
    if(cardId == 4){
        newCard.innerText = "Heal 4 HP";
    }
    if(cardId == 5){
        newCard.innerText = "Increase 1 DEF and heal 1 HP";
    }
    if(cardId == 6){
        newCard.innerText = "Increase 5 DEF while decrease 3 ATK";
    }
    if(cardId == 7){
        newCard.innerText = "Heal 15 HP while decrease both DEF and 2 ATK";
    }
    if(cardId == 8){
        newCard.innerText = "Decrease 2 DEF";
    }
    if(cardId == 9){
        newCard.innerText = "Heal 7 HP while decrease 2 ATK";
    }
    if(cardId == 10){
        newCard.innerText = "Instantly draw 2 cards";
    }
    newCard.addEventListener('click', async (e) => {
        useCardPhase();
        const targets = document.querySelectorAll(".target");
        for(let i=0;i<4;i++){
            if(!isDead[i]){
                targets[i].addEventListener('click',function handleClick(){
                    useCardOn(playersId[i],cardId);
                    targetChoose.style.display = 'none';

                    targets[i].removeEventListener('click',handleClick);
                });
            }
        }
        e.target.remove();
        await updateUserHand(-1);
    })
    return newCard;
}