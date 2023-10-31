
window.onload = async () => {
    let catData = await fetch("https://api.thecatapi.com/v1/images/search");
    catData = await catData.json();

    const div = document.createElement("div");
    const span = document.createElement("span");
    const img = document.createElement("img");

    div.setAttribute("class", "Cat_Card")
    span.innerText = "Kitten Pic";
    img.setAttribute("src", catData[0].url);

    div.append(span, img);
    document.querySelector("body").append(div);
}