var express = require("express"); // minimal and flexible Node.js web application framework
const dotenv = require("dotenv").config(); // allows you to separate secrets from your source code
var mongoose = require("mongoose"); // schema-based solution to model application data
var url = require("url"); // url validation checker
var sh = require("shorthash"); //short hash string generator

// Connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose Schema
var urlSchema = new mongoose.Schema({
  url: String,
  hash: String,
});

// Mongoose Model
var Url = mongoose.model("Url", urlSchema);

// Initialize Express
var app = express();

// parses incoming requests (request.body) with urlencoded payloads and is based on body-parser
app.use(express.urlencoded({ extended: true }));
// parses incoming requests (request.body) with JSON payloads and is based on body-parser
app.use(express.json());

// Make public static folder accesible
app.use("/public", express.static(process.cwd() + "/public"));

// Home Page
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// api returns {original_url, short_route}
app.post("/api/shorturl/new", function (req, res) {
  let userInput = url.parse(req.body.url); // parsing and storing user input
  // if it is a valid url
  if (userInput.hostname) {
    let short_url = sh.unique(req.body.url);
    var myData = new Url({ url: req.body.url, hash: short_url }); // API that send short route for valid url in json format
    myData
      .save()
      .then((item) => {
        res.json({ original_url: userInput.href, short_url }); // API which user can grab
      })
      .catch((err) => {
        res.status(400).send("unable to save to database");
      });
  } else {
    res.json({ error: "invalid URL" });
  }
});

// action while client hit to the short url
app.get("/:hash", function (req, res) {
  Url.findOne({ hash: req.params.hash }, function (err, route) {
    if (route) {
      res.redirect(route.url);
    } else {
      res.redirect("/");
    }
  });
});

// Start the server
app.listen(3000, function () {
  console.log("Listening on port 3000");
});
