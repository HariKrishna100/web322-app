const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
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
            
       })
    })
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
        
    })
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
        
    })
}