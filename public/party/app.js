const parties = [
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    },
    {
        users: ["Pete", "James", "Ohm", "Bob"]
    }
];

const main = document.getElementById("main");

for (let i = 0; i < parties.length; i++) {
    const party = document.createElement("div")
    party.className = "party";
    main.appendChild(party);
}