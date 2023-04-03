const mongoose = require("mongoose");
const { UPDATE } = require("sequelize/types/query-types");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  "userName": {
     type: String,
     unique: true,
  },
  "password": String,
  "email": String,
  "loginHistory": [{
      "dateTime": Date,
      "userAgent": String,
    }],
});

let User;

function initialize() {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("mongodb+srv://Web322App:Kali!@Linux$@web322app.6022oww.mongodb.net/?retryWrites=true&w=majority");
    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if(userData.password != userData.password2){
            reject("Incorrect Password");
        } else{
            //Bcrypt.hash(userData.password, 10).then((hash) => {})
            let newUser = new User(userData);
            newUser.save().then(() => {
                resolve();
            }).catch((err) => {
                if(err.code === 11000){
                    reject("User Name already taken");
                } else {
                   reject(`There was an error creating the user: ${err}`); 
                }
            })

        }
    })
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
       User.find({ userName: userData.userName })
       .exec()
       .then((users) => {
            if(users.length === 0) {
                reject(`Unable to find user: ${user.userName}`);
            } else {
                (users[0].password != userData.password) ?
                    reject(`Incorrect Password for user: ${userData.userName}`) :
                    resolve(user[0]);

                User.updateOne(
                    { "userName": users[0].userName },
                    { "$set": {"loginHistory": users[0].loginHistory}}
                ).catch((err) => {
                    reject(`There was an error verifying the user: ${err}`)
                })
            }
       }).catch((err) => {
          reject(`Unable to find user: ${userData.userName}`);
        })
    })
}

module.exports = {
    initialize,
    registerUser,
    checkUser
}