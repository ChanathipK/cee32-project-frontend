var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var yourCards = [];

// Variables to store the initial position of the mouse and rectangle
var initialX;
var initialY;
var initialLeft;
var initialTop;
var rectangle;

function draw() {
    let cardIndex = Math.floor(Math.random() * deck.length);
    let cardInfo = deck.splice(cardIndex, 1)[0];
    yourCards.push(cardInfo);

    var newRectangle = createRectangle();
    newRectangle.innerText = cardInfo;
}

function createRectangle() {
    var newRectangle = document.createElement('div');
    newRectangle.classList.add('rectangle-card');
    newRectangle.innerText = '[Card]';
    newRectangle.style.position = 'absolute';
    newRectangle.style.left = '50%';
    newRectangle.style.top = '80%';
    document.body.appendChild(newRectangle);

    // Attach dragging functionality to the new rectangle
    newRectangle.addEventListener('mousedown', onMouseDown);

    return newRectangle;
}

function onMouseDown(event) {
    // Store the initial position of the mouse and rectangle
    initialX = event.clientX;
    initialY = event.clientY;
    initialLeft = parseInt(event.target.style.left);
    initialTop = parseInt(event.target.style.top);
    rectangle = event.target;

    // Add event listeners for mousemove and mouseup events
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    
    // Prevent default action to avoid text selection during drag
    event.preventDefault();
}

function onMouseMove(event) {
    var deltaX = event.clientX - initialX;
    var deltaY = event.clientY - initialY;
    var newLeft = initialLeft + deltaX;
    var newTop = initialTop + deltaY;

    rectangle.style.left = newLeft + 'px';
    rectangle.style.top = newTop + 'px';
}

function onMouseUp() {
    // Remove event listeners for mousemove and mouseup events
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

// Add event listener for mousedown event on the document
document.addEventListener('mousedown', function(event) {
    if (event.target.classList.contains('rectangle-card')) {
        onMouseDown(event);
    }
});

// Add event listener for click event on the "Draw" button
document.getElementById("draw").addEventListener("click", draw);
