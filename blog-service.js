const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "qkfjqwjy",
  "qkfjqwjy",
  "w6YhcaLJAXNmfjo3PloGCp1VEN-k-bif",
  {
    host: "ruby.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: "category" });

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
    .then(() => {
        resolve()
    }).catch(()=>{
        reject("unable to sync the database");
    })
  });
}

function getAllPosts() {
  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            published: true,
        },
    }).then((data) => {
        resolve(data);
    }).catch(() => {
        reject("no results returned");
    })
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            category: category,
            published: true,
        },
    }).then((data) => {
        resolve(data);
    }).catch(() => {
        reject("no results returned");
    })
  });
}

function getPostsByMinDate(minDate) {
  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            postDate: {
                [gte]: new Date(minDateStr),
            },
        },
    }).then((data) => {
        resolve(data);
    }).catch(() => {
        reject("no results returned");
    })
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            id: id,
        },
    }).then((data) => {
        resolve(data[0]);
    }).catch(() => {
        reject("no results returned");
    })
  });
}

function addPost(postData) {
  return new Promise((resolve, reject) => {
    postData.published = (postData.published) ? true : false;

    for (const key in postData) {
        if (postData[i] === "") {
            postData[i] = null;
        }
    }

    postData.postDate = new Date();

    Post.create(postData).then(() => {
        resolve(data);
    }).catch(() => {
        reject("unable to create post");
    })
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            published: true,
        }, 
    }).then((data) => {
        resolve(data)
    }).catch(() => {
        reject("no results returned");
    })
  });
}

function getPublishedPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
        where: {
            category: category,
            published: true,
        },
    }).then((data) => {
        resolve(data);
    }).catch(() => {
        reject("no results returned");
    })
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    Category.findAll().then((data) => {
        resolve(data)
    }).catch(() => {
        reject("no results returned");
    })
  });
}


module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostById,
  getPostsByCategory,
  getPostsByMinDate,
  getPublishedPostsByCategory,
};