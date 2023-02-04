/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Harikrishna Paresh Patel Student ID: 150739217 Date: 02/03/2023
*
*  Cyclic Web App URL: https://careful-deer-spacesuit.cyclic.app/
*
*  GitHub Repository URL: https://github.com/HariKrishna100/web322-app
*
********************************************************************************/ 


const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080

const { initialize, getPublishedPosts, getAllPosts, getCategories } = require("./blog-service.js");

var path = require("path");

app.use(express.static("public"));

// setup another route to listen on /about
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"views", "about.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"views", "about.html"));
});

// setup another route to listen on /blog
app.get("/blog", function(req,res){
    getPublishedPosts().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    })
});


// setup another route to listen on /blog
app.get("/posts", function(req,res){
    getAllPosts().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    })
});

// setup another route to listen on /categories
app.get("/categories", function(req,res){
    getCategories().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    })
});

app.use((req, res) => {
    res.status('404').end('Page Not Found: Error 404');
})

initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("Express http server listening on: " + HTTP_PORT);
    });
})