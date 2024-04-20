const loadButton = document.getElementById("load-button");
const loadingScreen = document.getElementById("loading-screen");
const loadingMessage = document.getElementById("loading-message");
const main = document.getElementById("main");

loadButton.addEventListener("click", async () => {
    main.className = "blur";
    loadingScreen.className = "show-flex";
    loadButton.disabled = true;
    let dotCount = 1;
    const tempInterval = setInterval(() => {
        dotCount++;
        if (dotCount === 4) {
            dotCount = 1;
        }
        let message = "loading";
        for (let i = 0; i < dotCount; i++) {
            message += ".";
        }
        loadingMessage.innerText = message;
    }, 500);
    await new Promise((resolve) => {
        setTimeout(resolve, 5000);
    });

    clearInterval(tempInterval);

    main.className = "";
    loadingScreen.className = "hide";
    loadButton.disabled = false;

})