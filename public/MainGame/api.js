import { BACKEND_URL } from "./config.js";

const userId = localStorage.getItem("userId")
const partyId = localStorage.getItem("partyId")

export async function getCards() {
  const player = await fetch(`${BACKEND_URL}/api/v1/game/${userId}`).then((r) => r.json());
  console.log(r)
  return cards;
}

export async function draw() {
  let id = partyId;
  const card = await fetch(`${BACKEND_URL}/api/v1/game/draw/${id}`);
  return card;
}

// export async function getCard(id) {
//     const card = await fetch(`${BACKEND_URL}/cards/${id}`).then((r) => r.json());
//     return card;
// }

export async function playCard(id) {
  await fetch(`${BACKEND_URL}/users/cards/:userId`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cards),
  });
}

// export async function deleteCard(id, cards) {
//   await fetch(`${BACKEND_URL}/cards/${id}`, {
//     method: "DELETE",
//   });
// }


// export async function createCard(card) {
//   await fetch(`${BACKEND_URL}/cards`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(card),
//   });
// }


export async function set(item) {
    await fetch(`${BACKEND_URL}/users/cards/:userId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cards),
    });
  }

export async function getParty(){
  const party = await fetch(`${BACKEND_URL}/api/v1/game/parties/${partyId}`)
  return party;
}