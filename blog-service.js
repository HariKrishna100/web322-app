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

function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredPosts = posts.filter(post => post.category == category);

        if (filteredPosts.length === 0) {
            reject("no results returned");
        } else {
            resolve(filteredPosts);
        }
    })
}

function getPostsByMinDate(minDate) {
    return new Promise((resolve, reject) => {
        const filteredPosts = posts.filter(post => new Date(post.postDate) >= new Date(minDate));

        if (filteredPosts.length === 0) {
            reject("no results returned");
        } else {

            resolve(filteredPosts);
        }
    })
}

function getPostById(id) {
    return new Promise((resolve, reject) => {
        const filteredPosts = posts.filter(post => post.id == id);
        const uniquePost = filteredPosts[0];

        if (uniquePost) {
            resolve(uniquePost);
        }
        else {
            reject("no result returned");
        }
    })
}

function addPost(postData){
    return new Promise ((resolve, reject) => {
        if(postData.published === undefined) {
            postData.published = false;
        } else {
            postData.published = true;
        }

        postData.id = posts.length + 1;
        posts.push(postData);
        resolve(postData);
    })
}

function  getPublishedPostsByCategory(category){
    return new Promise((resolve, reject) => {
        var publishedPost = [];
        
        posts.forEach(post => {
            if(post.published === true && post.category == "category"){
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

module.exports = { 
    initialize, getAllPosts, getPublishedPosts, getCategories, 
    addPost, getPostById, getPostsByCategory, getPostsByMinDate,
    getPublishedPostsByCategory
};