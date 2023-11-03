export async function create_Pokedex() {
    const mainDiv = document.querySelector(".pokedex-container");

    applyButtonFunctions();
    create_PokeCommentInput();
    await fill_PokeCard(mainDiv);
    await setData(mainDiv.getAttribute("data-id"));
}

async function fill_PokeCard(div) {
    let pokeData;
    let id = sessionStorage.getItem("id");
    const number = document.querySelector("#pokedex-number");
    const yellow = document.querySelector("#yellow-indicator");
    const green = document.querySelector("#green-indicator");
    
    if (!id) id = 4;

    yellow.classList.add("glow");
    pokeData = await fetch(`/pokemon/${id}`);
    pokeData = await pokeData.json();
    yellow.classList.remove("glow");
    
    green.classList.add("glow");
    setTimeout(() => green.classList.remove("glow"), 250);

    const span = document.querySelector("#pokedex-details");
    const img = document.querySelector("#pokedex-screen");

    div.setAttribute("data-id", id);
    div.setAttribute("data-url", pokeData.url);
    div.setAttribute("data-name", pokeData.name);
    number.innerText = `#${id.toString().padStart(4, "0")}`
    span.innerText = pokeData.name;
    img.setAttribute("src", pokeData.url);

    fill_PokeComments(pokeData.comments);
    fill_PokeVote(pokeData.upvotes, pokeData.downvotes);
}

function applyButtonFunctions() {
    const clearVote = () => {
        const upvote = document.querySelector("#pokedex-upvote");
        const downvote = document.querySelector("#pokedex-downvote");
        upvote.setAttribute("data-checked", "unchecked");
        downvote.setAttribute("data-checked", "unchecked");
    }

    const nextCatFunc = async (e) => {
        const red = document.querySelector("#red-indicator");
        const yellow = document.querySelector("#yellow-indicator");
        const green = document.querySelector("#green-indicator");
        const name = document.querySelector("#pokedex-details");
        const img = document.querySelector("#pokedex-screen");
        const mainDiv = document.querySelector(".pokedex-container");

        red.classList.add("glow");
        let catData = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=live_VYTaEUgfdnZx4OKDQrWiBjN8GGHBHXFXppa3GOx2NGMxuwn8aftNmVsZILeHeFZ2");
        red.classList.remove("glow");

        yellow.classList.add("glow");
        catData = (await catData.json())[0];
        yellow.classList.remove("glow");

        green.classList.add("glow");
        setTimeout(() => green.classList.remove("glow"), 250);

        mainDiv.setAttribute("data-id", catData.id);
        name.innerText = catData.breeds[0].name;
        img.setAttribute("src", catData.url);
        clearVote();
        setData(catData.id);
    }
    document.querySelector("#pokedex-next").addEventListener("click", nextCatFunc);

    const voteFunc = async (e) => {
        const id = document.querySelector(".pokedex-container").getAttribute("data-id");
        const green = document.querySelector("#green-indicator");
        clearVote(); 
        e.currentTarget.setAttribute("data-checked", "checked")
        await fetch(`/pokemon/${id}/${e.currentTarget.getAttribute("id").split("-")[1]}`, {
            method:"PATCH"
        });
        const votes = await fetch(`/pokemon/${id}/votes`).then(response => response.json());
        
        const voteText = document.querySelector("#pokedex-vote-screen");
        voteText.innerText = votes[0] - votes[1];
        green.classList.add("glow");
        setTimeout(() => green.classList.remove("glow"), 250);
    }
    document.querySelector("#pokedex-upvote").addEventListener("click", voteFunc);
    document.querySelector("#pokedex-downvote").addEventListener("click", voteFunc);

    const trackFunc = () => {
        localStorage.setItem()
    }
    document.querySelector("#pokedex-track")

}

function create_PokeCommentInput() {
    // TODO: removed input function. Add hover event to prompt, click event to pop up
    // const input = document.querySelector("input");
}

function fill_PokeComments(div) {

}

function fill_PokeVote(upvote, downvote) {
    const upvoteCatButt = document.querySelector("#pokedex-upvote");
    const downvoteCatButt = document.querySelector("#pokedex-downvote");
    const voteText = document.querySelector("#pokedex-vote-screen");

    upvoteCatButt.setAttribute("data-checked", "unchecked");
    downvoteCatButt.setAttribute("data-checked", "unchecked");

    voteText.innerText = upvote - downvote;
}

async function setData(id) {
    sessionStorage.setItem("id", id);
}