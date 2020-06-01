var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");

// Require model
// var Product = require("./models/Product.js");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://shawonsaha:5DnUZBV4nHr3z8pw@nodefcc-wxnma.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

var urlSchema = new mongoose.Schema({
  url: String,
});

var Url = mongoose.model("Url", urlSchema);

var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public static folder
app.use("/public", express.static(process.cwd() + "/public"));

// Routes
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl/new", function (req, res) {
  // res.json({ req: req.body.url });
  var myData = new Url(req.body);
  myData
    .save()
    .then((item) => {
      res.send("item saved to database");
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("Listening on port " + PORT + ".");
});
