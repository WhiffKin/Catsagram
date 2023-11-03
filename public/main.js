export async function create_Pokedex() {
    const mainDiv = document.querySelector(".pokedex-container");

    applyButtonFunctions();
    create_PokeCommentInput();
    await fill_PokeCard(mainDiv);
    
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
    
    const advancedPokeData = (await (await fetch(pokeData.url)).json());
    console.log(advancedPokeData)
    
    div.setAttribute("data-id", id);
    div.setAttribute("data-name", pokeData.name);
    number.innerText = `#${id.toString().padStart(4, "0")}`
    span.innerText = `Name: ${pokeData.name}

Weight: ${advancedPokeData.weight}

Height: ${advancedPokeData.height}

Types: ${advancedPokeData.types.reduce((acc, type) => `${acc} ${type.type.name}`, "")}${advancedPokeData.stats.reduce((acc, statInfo) => `${acc}\n\n${capitalizeFirstLetter(statInfo.stat.name)}: ${statInfo.base_stat}`, "")}`;
    let imgURL =Math.random() < .2 ?advancedPokeData.sprites.front_shiny : advancedPokeData.sprites.front_default;
    imgURL = imgURL? imgURL : advancedPokeData.sprites.front_default;
    
    img.setAttribute("src", imgURL);
    div.setAttribute("data-url", imgURL);

    setData(div.getAttribute("data-id"), div.getAttribute("data-url"));
    fill_PokeComments(pokeData.comments);
    fill_PokeVote(pokeData.upvotes, pokeData.downvotes);
    fill_Tracked();
}

function applyButtonFunctions() {
    const clearVote = () => {
        const upvote = document.querySelector("#pokedex-upvote");
        const downvote = document.querySelector("#pokedex-downvote");
        upvote.setAttribute("data-checked", "unchecked");
        downvote.setAttribute("data-checked", "unchecked");
    }

    const nextPokemonFunc = async (e) => {
        const mainDiv = document.querySelector(".pokedex-container");
        clearVote();
        setData(Math.floor(Math.random() * 1000) + 1);
        fill_PokeCard(mainDiv);
    }
    document.querySelector("#pokedex-next").addEventListener("click", nextPokemonFunc);

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
        const red = document.querySelector("#red-indicator");
        const yellow = document.querySelector("#yellow-indicator");
        const green = document.querySelector("#green-indicator");
        
        for (let i = 0; i < 10; i++) {
            const tracked = sessionStorage.getItem(`tracked${i}`);
            if (!tracked) break;

            const [id, url] = tracked.split("&");
            console.log(sessionStorage.id, id);
            if (sessionStorage.id == id) {
                red.classList.add("glow");
                setTimeout(() => {
                    red.classList.remove("glow");
                }, 250);
                return;
            }
        }
        let prevTracked;
        yellow.classList.add("glow");
        for (let i = 0; i < 10; i++) {
            const tracked = sessionStorage.getItem(`tracked${i}`);
            sessionStorage.setItem(`tracked${i}`, prevTracked)
            if (!tracked) break;
            prevTracked = tracked;
            // const [url, id] = tracked;
            // trackedCont.children[i].setAttribute("data-id", id);
            // trackedCont.children[i].style.backgroundImage = `url('${url}')`;
        }
        yellow.classList.remove("glow");
        sessionStorage.setItem(`tracked0`, `${sessionStorage.id}&${sessionStorage.url}`)

        green.classList.add("glow");
        fill_Tracked();
        setTimeout(() => {
            green.classList.remove("glow");
        }, 250)
    }
    document.querySelector("#pokedex-track").addEventListener("click", trackFunc)

}

function create_PokeCommentInput() {
    const hoverButton = document.querySelector("#comment-input-button");
    
    hoverButton.addEventListener("mouseover", () => {
        const container = document.querySelector("#comment-input-container");
        const input = document.querySelector("#comment-input");
        container.style.display = "flex";
        input.focus()
    })
    hoverButton.addEventListener("mouseout", () => {
        const container = document.querySelector("#comment-input-container");
        container.style.display = "none";
    })
    hoverButton.addEventListener("click", async () => {
        const container = document.querySelector("#comment-input-container");
        const input = document.querySelector("#comment-input");
        container.style.display = "flex";
        await fetch(`/pokemon/${sessionStorage.id}/comments`, {
            method:"PATCH",
            headers:{"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({comment:input.value})
        })
        input.value = "";
        let res = await fetch(`/pokemon/${sessionStorage.id}`);
        res = await res.json();
        fill_PokeComments(res.comments);
    })
}

function fill_PokeComments(comments) {
    console.log(comments)
    const commentDiv = document.querySelector("#pokedex-screen-comments");
    commentDiv.innerText = comments.reduce((acc, el) => acc += el + "\n\n", "");
}

function fill_PokeVote(upvote, downvote) {
    const upvoteCatButt = document.querySelector("#pokedex-upvote");
    const downvoteCatButt = document.querySelector("#pokedex-downvote");
    const voteText = document.querySelector("#pokedex-vote-screen");

    upvoteCatButt.setAttribute("data-checked", "unchecked");
    downvoteCatButt.setAttribute("data-checked", "unchecked");

    voteText.innerText = upvote - downvote;
}

function fill_Tracked () {
    const trackedCont = document.querySelector("#pokedex-grid");
    for (let i = 0; i < 10; i++) {
        const tracked = sessionStorage.getItem(`tracked${i}`);
        if (!tracked) break;
        const [id, url] = tracked.split("&");
        console.log(url, id)
        trackedCont.children[i].setAttribute("data-id", id);
        trackedCont.children[i].setAttribute("src", url);
    }
}

async function setData(id, url) {
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("url", url);
}

function capitalizeFirstLetter(string) {
    if (string === "hp") return "HP";
    const stringArr = string.split("-");
        string = stringArr.reduce((acc, el) => acc + el.charAt(0).toUpperCase() + el.slice(1) + "-", "");
        string = string.slice(0, string.length-1)
    return string;
}