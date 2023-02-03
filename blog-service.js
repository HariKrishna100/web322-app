const fs = require("fs"); 
const { resolve } = require("path");
const path = require("path");

var posts = [];
var categories = [];

function initialize(){
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "data", "posts.json"), "utf-8", (err, data) => {
            if(err){
                reject("unable to read file");
            }

            posts = JSON.parse(data);

            fs.readFile(path.join(__dirname, "data", "categories.json"), "utf-8", (err, data) => {
                if(err){
                    reject("unable to read file");
                }

                categories = JSON.parse(data);

                resolve();
            });
        });
    })
}

function getAllPosts() {
    return new Promise((resolve, reject) => {
        if(posts.length === 0){
            reject("no results returned");
        }
        resolve(posts);
    });
}

function getPublishedPosts() {
    return new Promise((resolve, reject) => {
        var publishedPost = [];
        posts.forEach(post => {
            if(post.published === true){
                publishedPost.push(post);
            }
        });
        if(publishedPost.length === 0){
            reject("no results returned");
        }else {
            resolve(publishedPost);
        }
    });
}

function getCategories(){
    return new Promise ((resolve, reject) => {
        if(categories.length === 0){
            reject("no results returned");
        }
        resolve(categories);
    });
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories};