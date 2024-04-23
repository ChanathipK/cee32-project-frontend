import { BACKEND_URL } from "./config.js";

async function fetchParties(){
    const response = await fetch(`${BACKEND_URL}/api/v1/game/parties`)
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
    } else {
        alert("An error has occured during fetching all parties");
    }
}

async function fetchUserNameById(id){
    const response = await fetch(`${BACKEND_URL}/api/v1/users/${id}`);
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data.username;
    } else {
        alert(`An error has occured during fetching username with id : ${id}`);
    }
}

const parties = await fetchParties();

const userId = localStorage.getItem("userId");
const inParty = localStorage.getItem("partyId")!=null;

// if client has not registered navigate him back to login page
if(!userId){
    location.replace("http://107.20.74.210")
}

const main = document.getElementById("main");

setInterval(async ()=>{
    await updateParties()
},500)

async function updateParties(){
    while(main.firstChild){
        main.removeChild(main.firstChild)
    }
    const parties = await fetchParties()
    for (let i = 0; i < parties.length; i++) {
        // Create div party
        const party = document.createElement("div");
        party.className = "party";
        for(let j = 0; j < parties[i].users.length; j++){
            const partyMember = document.createElement("span");
            const username = await fetchUserNameById(parties[i].users[j]);
            partyMember.innerText = username;
            party.appendChild(partyMember);
        }
    
        // Create new button inside div party
        const newButton = document.createElement("button");
        newButton.innerText = "Join this party";
        // Prevent user from joining this party if it's full or user already have party
        if(parties[i].users.length == 4 || inParty)
            newButton.disabled = true;
        newButton.addEventListener("click", async (e)=>{
            const response = await fetch(`${BACKEND_URL}/api/v1/game/join/${parties[i]._id}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
    
                // Set current party in localStorage
                localStorage.setItem("partyId",parties[i]._id);
                location.reload();
    
                // if party is full navigate him to main page
                if(data.isReady){
                    location.replace("http://107.20.74.210/maingame")
                }
    
            } else {
                alert("An error has occured during joining party");
            }
        });
        party.appendChild(newButton);
    
        main.appendChild(party);
    }
}

if(!inParty){
    const newPartyBtn = document.createElement("div");
    newPartyBtn.id = "newPartyBtn";
    newPartyBtn.innerHTML = "<span>Create New Party</span>";
    newPartyBtn.addEventListener("click",async (e)=>{
        const response = await fetch(`${BACKEND_URL}/api/v1/game/create`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Set current party in localStorage
            localStorage.setItem("partyId",data._id);
            location.reload();
        } else {
            alert("An error has occured during creating new party");
        }
    });  
    main.appendChild(newPartyBtn);  
}

// Polling 

if(inParty){
    const partyId = localStorage.getItem("partyId");
    async function checkPartySize() {
        const response = await fetch(`${BACKEND_URL}/api/v1/game/parties/${partyId}`);
        if (response.ok) {
            const data = await response.json();

            // Your party is full
            if(data.users.length == 4){
                console.log("Ready!!");
                // Navigate him to game page
                location.replace("http://107.20.74.210/maingame")
            }
        } else {
            alert("An error has occured during polling phase");
        }
    }
    
    setInterval(async () => {
        await checkPartySize();
    }, 500); // Run every 5 seconds
}