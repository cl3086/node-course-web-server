const express = require("express");
const hbs = require("hbs");
// handlebars is a express viewing engine

const fs = require("fs");

var app = express();

// partials are "parts of a website"
hbs.registerPartials(__dirname + "/views/partials");

// setting key value pair
app.set("view engine", "hbs");

// middleware
// express.static takes the absolute path
// __dirname saves the path to our project directory
// .use() adds a function to the middleware stack
// middleware sits in the middle of a client request and server answers
// order of middleware matters!

// next exists tells express when the middleware is done
app.use((req, res, next) => {
    var now = new Date().toString();

    var log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile("server.log", log + "\n", (err) => {
        if(err){
            console.log("Unable to append to server.log.");
        }
    });
    next();
});

app.use((req, res, next) => {
    res.render("maintenance.hbs");
});

app.use(express.static(__dirname + "/public"));

// for repeating code that can be called in handlebars
hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
});

// handler for a http request
// req = request, res = response
app.get("/", (req, res) => {
    // this is the response for this request
    // res.send("<h1>Hello Express</h1>");
    // res.send({
    //     name: "Calvin",
    //     likes: [
    //         "chocolate",
    //         "cities"
    //     ]
    // });
    res.render("home.hbs", {
        pageTitle: "Home Page",
        message: "Welcome to the home page!"
    });
});

app.get("/about", (req, res) => {
    // res.send("About Page");
    // we do not have to specify a directory because "views" is the default directory to look into
    res.render("about.hbs", {
        pageTitle: "About Page",
        currentYear: new Date().getFullYear()
    });
});

app.get("/bad", (req, res) => {
    res.send({
        error: "Error handling request!"
    });
});

// listen takes also takes a function
app.listen(16000, () => {
    console.log("Server is on port 16000.");
});
