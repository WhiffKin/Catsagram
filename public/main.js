export async function create_Cat() {
    const mainDiv = document.createElement("div");
    mainDiv.setAttribute("class", "Cat_Card");

    await create_CatCard(mainDiv);
    await create_CatVote(mainDiv);
    applyButtonFunctions();
}

async function create_CatCard(div) {
    let catData = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=live_VYTaEUgfdnZx4OKDQrWiBjN8GGHBHXFXppa3GOx2NGMxuwn8aftNmVsZILeHeFZ2");
    catData = (await catData.json())[0];

    const span = document.createElement("span");
    const img = document.createElement("img");

    div.setAttribute("data-id", catData.id);
    span.innerText = catData.breeds[0].name;
    span.setAttribute("id", "Cat_Name");
    img.setAttribute("src", catData.url);
    img.setAttribute("id", "Cat_Img");

    div.append(span, img);
    document.querySelector("body").append(div);
}

async function create_CatVote(div) {
    const voteContainer = document.createElement("div");
    const nextCatButt = document.createElement("button");
    const upvoteCatButt = document.createElement("button");
    const downvoteCatButt = document.createElement("button");
    const voteText = document.createElement("span");

    voteContainer.setAttribute("class", "Cat_VoteBar");
    nextCatButt.setAttribute("class", "Cat_Next");

    upvoteCatButt.setAttribute("class", "Cat_Upvote");
    upvoteCatButt.setAttribute("data-checked", "unchecked");
    
    downvoteCatButt.setAttribute("class", "Cat_Downvote");
    downvoteCatButt.setAttribute("data-checked", "unchecked");

    // let vote = await fetch(`https://api.thecatapi.com/v1/votes/${div.getAttribute("data-id")}?api_key=live_VYTaEUgfdnZx4OKDQrWiBjN8GGHBHXFXppa3GOx2NGMxuwn8aftNmVsZILeHeFZ2`);
    // vote = await vote.json();
    // console.log(vote)
    voteText.innerText = "0";

    const rightDiv = document.createElement("div");
    rightDiv.style.display = "flex";
    rightDiv.append(upvoteCatButt, voteText, downvoteCatButt);
    voteContainer.append(nextCatButt, rightDiv)
    div.append(voteContainer);
}

export function applyButtonFunctions() {
    const clearVote = () => {
        const upvote = document.querySelector(".Cat_Upvote")
        const downvote = document.querySelector(".Cat_Downvote")
        upvote.setAttribute("data-checked", "unchecked")
        downvote.setAttribute("data-checked", "unchecked")
    }

    const nextCatFunc = async (e) => {
        const name = document.querySelector("#Cat_Name");
        const img = document.querySelector("#Cat_Img");

        let catData = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=live_VYTaEUgfdnZx4OKDQrWiBjN8GGHBHXFXppa3GOx2NGMxuwn8aftNmVsZILeHeFZ2");
        catData = (await catData.json())[0];

        name.innerText = catData.breeds[0].name;
        img.setAttribute("src", catData.url);
        clearVote();
    }
    document.querySelector(".Cat_Next").addEventListener("click", nextCatFunc);

    const voteFunc = (e) => {
        clearVote();
        if (e.currentTarget.getAttribute("data-checked") === "unchecked") 
            e.currentTarget.setAttribute("data-checked", "checked")
        else e.currentTarget.setAttribute("data-checked", "unchecked")
    }
    document.querySelector(".Cat_Upvote").addEventListener("click", voteFunc);
    document.querySelector(".Cat_Downvote").addEventListener("click", voteFunc);
}