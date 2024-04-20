var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var yourCards = [];
var cardAmount = 2;

// Variables to store the initial position of the mouse and rectangle
var initialX;
var initialY;
var initialLeft;
var initialTop;
var rectangle;

async function attackPlayer() {
    document.getElementById('attackText').textContent = 'Choose a player to attack!!';
    const ePlayer = document.querySelectorAll('.ePlayer');

    // Define a named function for the event listener
    function handleClick() {
        doDamage();
    }

    // Create a promise for the cancel action
    let cancelResolve;
    const cancelPromise = new Promise(resolve => {
        cancelResolve = resolve;
        document.getElementById('attack').textContent = "Cancel";
        document.getElementById('attack').addEventListener("click", cancelAction);
        function cancelAction() {
            resolve(true);
        }
    });

    // Add event listeners to each enemy player
    ePlayer.forEach(element => {
        element.addEventListener('click', async () => {
            // Remove event listeners from enemy players
            ePlayer.forEach(el => {
                el.removeEventListener('click', handleClick);
            });

            // Perform the attack action
            await doDamage();
        });
    });

    // Wait for either enemy player clicks or the cancel button click
    await Promise.race([].concat(Array.from(ePlayer).map(() => cancelPromise)));
    // Clean up the cancel promise
    cancelResolve(false);
    // Reset button text
    document.getElementById('attack').textContent = "Attack";
    document.getElementById('attack').addEventListener("click", attackPlayer);
    document.getElementById('attackText').textContent = '';
    draw();
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
    newCard.style.width = '100px';
    newCard.style.height = '150px';
    newCard.style.backgroundColor = '#b3b4ae';
    newCard.style.borderRadius = '5px';
    newCard.style.margin = '2vw 20px';
    newCard.style.transition = 'transform 0.3s';
    newCard.style.cursor = 'pointer';
    newCard.style.translate = '0 10vh';
    playerCards.appendChild(newCard);

    return newCard;
}

function useCard(id) {
    //To be impliment
}



// function createRectangle() {
//     var newRectangle = document.createElement('div');
//     newRectangle.classList.add('rectangle-card');
//     newRectangle.innerText = '[Card]';
//     newRectangle.style.position = 'absolute';
//     newRectangle.style.left = '50%';
//     newRectangle.style.top = '80%';
//     document.body.appendChild(newRectangle);

//     // Attach dragging functionality to the new rectangle
//     newRectangle.addEventListener('mousedown', onMouseDown);

//     return newRectangle;
// }

// function onMouseDown(event) {
//     // Store the initial position of the mouse and rectangle
//     initialX = event.clientX;
//     initialY = event.clientY;
//     initialLeft = parseInt(event.target.style.left);
//     initialTop = parseInt(event.target.style.top);
//     rectangle = event.target;

//     // Add event listeners for mousemove and mouseup events
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
    
//     // Prevent default action to avoid text selection during drag
//     event.preventDefault();
// }

// function onMouseMove(event) {
//     var deltaX = event.clientX - initialX;
//     var deltaY = event.clientY - initialY;
//     var newLeft = initialLeft + deltaX;
//     var newTop = initialTop + deltaY;

//     rectangle.style.left = newLeft + 'px';
//     rectangle.style.top = newTop + 'px';
// }

// function onMouseUp() {
//     // Remove event listeners for mousemove and mouseup events
//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);
// }

// // Add event listener for mousedown event on the document
// document.addEventListener('mousedown', function(event) {
//     if (event.target.classList.contains('rectangle-card')) {
//         onMouseDown(event);
//     }
// });


// Add event listener for click event on the "Draw" button
document.getElementById("attack").addEventListener("click", attackPlayer);
