import { BACKEND_URL } from "./config.js";

const userId = localStorage.getItem("userId")
const partyId = localStorage.getItem("partyId")

export async function getParty(){
  const response = await fetch(`${BACKEND_URL}/api/v1/game/parties/${partyId}`)
    if (response.ok) {
        const data = await response.json();
        // console.log(data);
        return data;
    } else {
        alert("An error has occured");
    }
}

export async function draw() {
  const response = await fetch(`${BACKEND_URL}/api/v1/game/draw/${partyId}`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return data;
  } else {
      alert("An error has occured during drawing cards");
  }
}

export async function updateStat(id, stat){
  await fetch(`${BACKEND_URL}/api/v1/users/stat/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stat),
  })
}

export async function getUser(id){
  const response = await fetch(`${BACKEND_URL}/api/v1/users/${id}`);
  if (response.ok) {
    const data = await response.json();
    // console.log(data);
    return data;
  } else {
      alert("An error has occured");
  }
}

export async function endTurn(){
  await fetch(`${BACKEND_URL}/api/v1/game/end/${partyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export async function updateUserHand(amount){
  await fetch(`${BACKEND_URL}/api/v1/users/hand/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      number : amount
    })
  });
}

export async function attack(targetId,isDefenceUsed){
  const response = await fetch(`${BACKEND_URL}/api/v1/users/attack/${targetId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: userId,
      isDefenceUsed: isDefenceUsed,
    })
  });
  if(response.ok){
    const data = await response.json();
    return data;
  }
  else{
    alert("an error occured during attacking")
  }
}