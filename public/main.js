export async function create_Cat() {
    const mainDiv = document.querySelector(".pokedex-container");

    await create_CatCard(mainDiv);
    await create_CatVote();
    // await create_CatComments(mainDiv);
    applyButtonFunctions();
    // await setData(mainDiv.getAttribute("data-id"),
    //               mainDiv.getAttribute("data-url"),
    //               mainDiv.getAttribute("data-name"));
}

async function create_CatCard(div) {
    let catData;
    const id = sessionStorage.getItem("id")
    if (id) {
        catData = await fetch(`https://api.thecatapi.com/v1/images/${id}`);
        catData = await catData.json();
    } else {
        catData = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=live_VYTaEUgfdnZx4OKDQrWiBjN8GGHBHXFXppa3GOx2NGMxuwn8aftNmVsZILeHeFZ2");
        catData = (await catData.json())[0];
    }

    const span = document.querySelector("#pokedex-details");
    const img = document.querySelector("#pokedex-screen");

    div.setAttribute("data-id", catData.id);
    div.setAttribute("data-url", catData.url);
    div.setAttribute("data-name", catData.breeds[0].name);
    span.innerText = catData.breeds[0].name;
    img.setAttribute("src", catData.url);
}

async function create_CatVote() {
    const upvoteCatButt = document.querySelector("#pokedex-upvote");
    const downvoteCatButt = document.querySelector("#pokedex-downvote");
    const voteText = document.querySelector("#pokedex-vote-screen");

    upvoteCatButt.setAttribute("data-checked", "unchecked");
    downvoteCatButt.setAttribute("data-checked", "unchecked");

    voteText.innerText = "0";
}

function applyButtonFunctions() {
    const clearVote = () => {
        const upvote = document.querySelector("#pokedex-upvote");
        const downvote = document.querySelector("#pokedex-downvote");
        upvote.setAttribute("data-checked", "unchecked");
        downvote.setAttribute("data-checked", "unchecked");
    }

    const nextCatFunc = async (e) => {
        const name = document.querySelector("#pokedex-details");
        const img = document.querySelector("#pokedex-screen");
        const mainDiv = document.querySelector(".pokedex-container");

        let catData = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=live_VYTaEUgfdnZx4OKDQrWiBjN8GGHBHXFXppa3GOx2NGMxuwn8aftNmVsZILeHeFZ2");
        catData = (await catData.json())[0];

        mainDiv.setAttribute("data-id", catData.id);
        name.innerText = catData.breeds[0].name;
        img.setAttribute("src", catData.url);
        setData(catData.id);
    }
    document.querySelector("#pokedex-next").addEventListener("click", nextCatFunc);

    const voteFunc = (e) => {
        clearVote();
        if (e.currentTarget.getAttribute("data-checked") === "unchecked") 
            e.currentTarget.setAttribute("data-checked", "checked")
        else e.currentTarget.setAttribute("data-checked", "unchecked")
    }
    document.querySelector("#pokedex-upvote").addEventListener("click", voteFunc);
    document.querySelector("#pokedex-downvote").addEventListener("click", voteFunc);
}

async function create_CatComments(div) {
    const comments = document.createElement("textarea");
    const input = document.createElement("input");
    const submit = document.createElement("button");

    comments.setAttribute("class", "Cat_Comments");
    comments.setAttribute("readonly", true);

    input.setAttribute("type", "text");
    input.setAttribute("class", "Cat_Input");

    submit.setAttribute("class", "Cat_InputSubmit");

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.width = "400px";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";
    container.append(input, submit);

    div.append(comments, container);
}

async function setData(id, url, name) {
    const cat = await fetch(`/cats/${id}`);
    if (cat.status >= 400 && cat.status < 500) {
        fetch("/cats", {
            method:"POST",
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                id, url, name
            })
        })
    } else {
        const resBody = JSON.parse(cat.body);
        console.log(resBody);
    };
    sessionStorage.setItem("id", id);
}