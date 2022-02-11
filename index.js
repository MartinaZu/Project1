const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const post = require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//when the user opens up the Website, give him the index.html
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

//When the user have clicked at the About page, give him about.html
app.get("/about.html", function(req, res) {
    res.sendFile(__dirname + "/about.html");
});

//When the user have clicked at the Contact page, give him contact.html
app.get("/contact.html", function(req, res) {
    res.sendFile(__dirname + "/contact.html");
});

//When the user clicks at Logo, take him at the index.html
//document.querySelector("#logo").setAttribute("href", "/");

//Function that allows the user to write something into the Sign Up form
app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

//The informations from the user is going to be saved as an object
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

//We stringify now the data from the object
    const jsonData = JSON.stringify(data);

//Url and options that we need for the request to the Mailchimp
    const url = "https://us14.api.mailchimp.com/3.0/lists/0633540c4d";
    const options = {
        method: "POST",
        auth: "martina1:47f0ee7e1399ab713bc6cae0b6248820-us14"
    }

//Sending a request to the Mailchimp and giving it 2 situations what to to with the Website
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    }) 

    request.write(jsonData);
    request.end();
});

//When signing up have failed and the user have clicked at the Try again button, redirect to the index.html
app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running at port 3000.");
});

//API Key for the Newsletter
//47f0ee7e1399ab713bc6cae0b6248820-us14

//List ID
//0633540c4d
