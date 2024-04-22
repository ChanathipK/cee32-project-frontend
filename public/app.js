import { BACKEND_URL } from "./config.js";
// If user has already register navigate him to the party room
const localData = localStorage.getItem("userId");
if(localData){
    // do something
    const partyUrl = window.location + "/party";
    window.location = partyUrl;
}

const form = document.querySelector("form");
const formInput = document.querySelector("#username-input");
const formTerm = document.querySelector("#terms-checkbox");

form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    if(!formTerm.checked){
        // Check terms and agreements
        alert("You must agree with our term!!");
    }
    else{
        // Create a new user
        const response = await fetch(`${BACKEND_URL}/api/v1/users/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formInput.value,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // Save the returned userId in localStorage
            localStorage.setItem("userId",data);
            const partyUrl = window.location + "/party";
            window.location = partyUrl;
        } else {
            alert("An error has occured");
        }
    }
});