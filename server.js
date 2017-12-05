// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Requiring all models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/scrape-controller.js");

app.use("/", routes);

// Connect to the Mongo DB
mongoose.Promise = Promise;

// Connect to localhost if not a production environment
if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_w6gf0pmk:b5dr7a0heneu2tmlv8runfto1t@ds155634.mlab.com:55634/heroku_w6gf0pmk');
}
else{
  mongoose.connect("mongodb://localhost/newsScrape", {
  useMongoClient: true
	});
}

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
