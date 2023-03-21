/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Harikrishna Paresh Patel Student ID: 150739217 Date: 02/22/2023
 *
 *  Cyclic Web App URL: https://careful-deer-spacesuit.cyclic.app/
 *
 *  GitHub Repository URL: https://github.com/HariKrishna100/web322-app
 *
 ********************************************************************************/

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const exphbs = require("express-handlebars");
const stripJs = require("strip-js");
const blogData = require("./blog-service.js");
const path = require("path");
const app = express();
const upload = multer();
const HTTP_PORT = process.env.PORT || 8080;

const {
  initialize,
  getAllPosts,
  getCategories,
  addPost,
  getPostById,
  getPostsByCategory,
  getPostsByMinDate,
} = require("./blog-service.js");

app.use(express.static("public"));

cloudinary.config({
  cloud_name: "dsjmp50vm",
  api_key: "871462464943897",
  api_secret: "HDD73Y4KdTMKxnupfUGtgxL2Ks0",
  secure: true,
});

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },

      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },

      safeHTML: function (context) {
        return stripJs(context);
      },
    },
  })
);

app.set("view engine", ".hbs");

// setup another route to listen on /about
app.get("/", function (req, res) {
  res.redirect("/blog");
});

app.get("/about", function (req, res) {
  res.render("about");
});

// setup another route to listen on /blog
app.get("/posts", function (req, res) {
  if (req.query.category) {
    getPostsByCategory(req.query.category)
    .then((data) => {
        res.render("posts", {posts: data})
    })
    .catch(() => {
        res.render("posts", { message: "no results" })
    });
  } else if (req.query.minDate){
    getPostsByMinDate(req.query.minDate)
    .then((data) => {
        res.render("posts", { posts: data })
    })
    .catch(() => {
        res.render("posts", { message: "no results" })
    })
  } else {
    getAllPosts()
    .then((data) => {
        res.render("posts", { posts: data })
    })
    .catch(() => {
        res.render("posts", { message: "no results" })
    })
  }
});

app.get("/posts/add", function (req, res) {
  res.render("addPost");
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    return result;
  }

  upload(req)
    .then((uploaded) => {
      req.body.featureImage = uploaded.url;
      let postObj = {};

      postObj.body = req.body.body;
      postObj.title = req.body.title;
      postObj.postDate = new Date().toISOString().slice(0, 10);
      postObj.category = req.body.category;
      postObj.featureImage = req.body.featureImage;
      postObj.published = req.body.published;

      if (postObj.title) {
        addPost(postObj);
      }
      res.redirect("/posts");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/post/:value", (req, res) => {
  getPostById(req.params.value)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// setup another route to listen on /categories
app.get("/categories", function (req, res) {
  getCategories()
    .then((data) => {
      res.render("categories", { categories: data });
    })
    .catch(() => {
      res.render("categories", { message: "nos results" });
    });
});

app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.use((req, res) => {
  res.status(404).render("404",{layout:"main.hbs"})
});

initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
});
