var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var yourCards = [];
var cardAmount = 2;

const attack = document.getElementById('attack')
const interact = document.getElementById('interact')
const ePlayer = document.querySelectorAll('.ePlayer');
const block = document.getElementById('block')

attack.addEventListener("click", attackPlayer);

function attackPlayer() {
    attack.disabled = true
    document.getElementById('attackText').textContent = 'Choose a player to attack!!';
    block.style.display = 'inline'

    // Define a named function for the event listener
    function handleClick() {
        doDamage();
        console.log("do")
        attack.disabled = false
        document.getElementById('attackText').textContent = '';
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



function doDamage(){
    //To be impliment
}


function draw() {
    if(cardAmount < 5){
        let cardIndex = Math.floor(Math.random() * deck.length);
        let cardInfo = deck.splice(cardIndex, 1)[0];
        yourCards.push(cardInfo);

        var newCard = addCard();
        newCard.innerText = cardInfo;
        cardAmount += 1;
    }
}

function addCard() {
    console.log('draw')
    var newCard = document.createElement('div');
    newCard.classList.add('card');
    playerCards.appendChild(newCard);

    return newCard;
}

function useCard(id) {
    //To be impliment
}