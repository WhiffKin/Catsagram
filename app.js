const http = require("http");
const { readFileSync } = require("fs");
const path = require("path");
const { runInNewContext } = require("vm");

const pokeData = {}
// Create a server using `http`
const server = http.createServer((req, res) => {
  console.log(`Incoming Request - Method: ${req.method} | URL: ${req.url}`);
  // Process the body of the request
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });
  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }
    // Home Page
    if (req.method === "GET" && req.url === "/") {
      const resBody = readFileSync("./public/index.html");
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(resBody);
      return;
    }
    // Serving Static Assets
    const ext = path.extname(req.url);
    if (req.method === "GET" && ext) {
      try {
        const resBody = readFileSync('.' + "/public" + req.url);
        res.statusCode = 200;
        if (ext === ".jpg" || ext === ".jpeg") {
          res.setHeader("Content-Type", "image/jpeg");
        } else if (ext === ".css") {
          res.setHeader("Content-Type", "text/css");
        } else if (ext === ".js") {
          res.setHeader("Content-Type", "text/javascript");
        }
        res.end(resBody);
        return;
      } catch {
        console.error(
          "Cannot find asset",
          path.basename(req.url),
          "in assets folder"
        );
      }
    }
    // Adding to Upvote
    const splitURL = req.url.split("/");
    splitURL.shift()
    if (req.method === "PATCH" && splitURL[0] === "pokemon" && splitURL[2] === "upvote" && pokeData.hasOwnProperty(splitURL[1])) {
      pokeData[splitURL[1]].upvotes++;
      res.statusCode = 200;
      res.setHeader("Location", `/pokemon/:id`)
      return res.end();
    }
    // Adding to Downvote
    if (req.method === "PATCH" && splitURL[0] === "pokemon" && splitURL[2] === "downvote" && pokeData.hasOwnProperty(splitURL[1])) {
      pokeData[splitURL[1]].downvotes++;
      res.statusCode = 200;
      res.setHeader("Location", `/pokemon/:id`)
      return res.end();
    }
    // Adding to Comments
    if (req.method === "PATCH" && splitURL[0] === "pokemon" && splitURL[2] === "comments" && pokeData.hasOwnProperty(splitURL[1])) {
      const comment = reqBody.split("=")[1].split("+").join(" ");
      pokeData[splitURL[1]].comments.push(comment);
      res.statusCode = 200;
      res.setHeader("Location", `/pokemon/:id`)
      return res.end();
    }
    // Getting pokemon Votes
    if (req.method === "GET" && splitURL[0] === "pokemon" && splitURL[2] === "votes" && pokeData.hasOwnProperty(splitURL[1])) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json")
      const resBody = JSON.stringify([pokeData[splitURL[1]].upvotes, pokeData[splitURL[1]].downvotes]);
      return res.end(resBody);
    }
    // Getting pokemon Data
    if (req.method === "GET" && splitURL[0] === "pokemon" && pokeData.hasOwnProperty(splitURL[1])) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json")
      const resBody = JSON.stringify(pokeData[splitURL[1]]);
      return res.end(resBody);
    }
    // Page Not Found
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    const resBody = "Page Not Found";
    res.write(resBody);
    res.end();
  });
});

async function initializeServer() {
  const resData = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1292%22")
    .then(response => response.json());
    
  let acc = 1;
  resData.results.forEach(pokemon => {
    pokeData[acc++] = {
      name: pokemon.name,
      url: pokemon.url,
      comments: [],
      upvotes: 0,
      downvotes: 0
    };
  })

  pokeData["4"].comments.push("Just caught my first one!!!");
  pokeData["4"].comments.push("Spotted at one at Lumoise City!");
  pokeData["4"].comments.push("Would anyone want to trade for a Bulbasaur?");
  pokeData["4"].upvotes = 151;

  // Set the port to 5000
  const port = 5000;
  // Tell the port to listen for requests on localhost:5000
  server.listen(port, () => console.log("Server is running on port", port));
}
initializeServer();