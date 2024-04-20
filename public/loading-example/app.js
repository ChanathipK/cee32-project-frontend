// get all the needed element
const loadButton = document.getElementById("load-button");
const loadingScreen = document.getElementById("loading-screen");
const loadingMessage = document.getElementById("loading-message");
const main = document.getElementById("main");

// add event to button when click
loadButton.addEventListener("click", async () => {

    // as soon as we click load-button, we change some style to loading state
    main.className = "blur";
    loadingScreen.className = "show-flex";
    loadButton.disabled = true;

    // this part is to make the "." in "Loading..." looks better
    let dotCount = 1;
    const tempInterval = setInterval(() => {
        dotCount++;
        if (dotCount === 4) {
            dotCount = 1;
        }
        let message = "Loading";
        for (let i = 0; i < dotCount; i++) {
            message += ".";
        }
        loadingMessage.innerText = message;
    }, 500);

    // mock wait (fake wait for 5 seconds)
    await new Promise((resolve) => {
        setTimeout(resolve, 5000);
    });

    // after waiting finished, we clear interval an set styles back to normal
    clearInterval(tempInterval);

    main.className = "";
    loadingScreen.className = "hide";
    loadButton.disabled = false;
});