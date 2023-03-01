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

const { initialize, getAllPosts, getPublishedPosts, getCategories, 
        addPost, getPostById, getPostsByCategory, getPostsByMinDate 
} = require("./blog-service.js");

var path = require("path");

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer(); 

app.use(express.static("public"));

cloudinary.config({
    cloud_name: 'dsjmp50vm',
    api_key: '871462464943897',
    api_secret: 'HDD73Y4KdTMKxnupfUGtgxL2Ks0',
    secure: true
});

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

app.get("/post/:value", (req, res)=>{
    getPostById(req.params.value).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send(err);
    })
})

// setup another route to listen on /blog
app.get("/posts", function(req,res){
    if (req.query.category) {
        getPostsByCategory(req.query.category)
        .then((data)=>{
            res.send(data);
        }).catch((err)=>{
            res.send(err);
        });
    } else if (req.query.minDateStr) {
        getPostsByMinDate(req.query.minDateStr)
        .then((data)=>{
            res.send(data);
        }).catch((err)=>{
            res.send(err);
        });
    } else {
        getAllPosts().then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
    }
});

// setup another route to listen on /categories
app.get("/categories", function(req,res){
    getCategories().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    })
});

app.get("/posts/add", function(req, res){
    res.sendFile(path.join(__dirname,"views", "addPost.html"));
})

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        return result;
    }

    upload(req).then((uploaded) => {
        req.body.featureImage = uploaded.url;
        let postObj = {};

        postObj.body = req.body.body;
        postObj.title = req.body.title;
        postObj.postDate = Date.now();
        postObj.category = req.body.category;
        postObj.featureImage = req.body.featureImage;
        postObj.published = req.body.published;

        if(postObj.title){
            addPost(postObj);
        }
        res.redirect("/posts");
    }).catch((err)=>{
        res.send(err);
    })
});

app.use((req, res) => {
    res.status('404').end('Page Not Found: Error 404');
});

initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("Express http server listening on: " + HTTP_PORT);
    });
});