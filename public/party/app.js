async function fetchParties(){
    const response = await fetch("http://localhost:5000/api/v1/game/parties",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
    } else {
        alert("An error has occured");
    }
}

const parties = await fetchParties();

const userId = localStorage.getItem("userId");
const inParty = localStorage.getItem("partyId")!=null;

// if client has not registered navigate him back to login page
if(!userId){
    window.location = "http://localhost:5500";
}

const main = document.getElementById("main");

for (let i = 0; i < parties.length; i++) {
    // Create div party
    const party = document.createElement("div");
    party.className = "party";
    for(let j = 0; j < parties[i].users.length; j++){
        const partyMember = document.createElement("span");
        partyMember.innerText = parties[i].users[j];
        party.appendChild(partyMember);
    }

    // Create new button inside div party
    const newButton = document.createElement("button");
    newButton.innerText = "Join this party";
    // Prevent user from joining this party if it's full or user already have party
    if(parties[i].users.length == 4 || inParty)
        newButton.disabled = true;
    newButton.addEventListener("click", async (e)=>{
        const response = await fetch(`http://localhost:5000/api/v1/game/join/${parties[i]._id}`,{
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

            // if party is full
            if(data.isReady){

            }

        } else {
            alert("An error has occured");
        }
    });
    party.appendChild(newButton);

    main.appendChild(party);
}

if(!inParty){
    const newPartyBtn = document.createElement("div");
    newPartyBtn.id = "newPartyBtn";
    newPartyBtn.innerHTML = "<span>Create New Party</span>";
    newPartyBtn.addEventListener("click",async (e)=>{
        const response = await fetch("http://localhost:5000/api/v1/game/create",{
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
            alert("An error has occured");
        }
    });  
    main.appendChild(newPartyBtn);  
}