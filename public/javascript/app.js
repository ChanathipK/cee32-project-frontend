var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var yourCards = [];
var cardAmount = 2;

const attack = document.getElementById('attack')
const interact = document.getElementById('interact')
const ePlayer = document.querySelectorAll('.ePlayer');
const block = document.getElementById('block')
const playerHealthElements = document.querySelectorAll('.player .health');
const enemyHealthElements = document.querySelectorAll('.ePlayer .health');

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

var turnCounter = [0,0,0,0,0,0,0,0,0,,0]; // count each remaining card effect time

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
function useCard(id) {

}