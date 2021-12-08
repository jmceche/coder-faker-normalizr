import express from 'express';
import bcrypt from "bcrypt";

import User from "../models/user.js"

import session from "express-session"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"


const { Router } = express;
const router = new Router();


/** PASSPORT */
router.use(session({
  secret: 'keyboard cat',
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 10000,
  },
  rolling: true,
  resave: true,
  saveUninitialized: false
}));

router.use(passport.initialize())
router.use(passport.session())

passport.use("local-login", new LocalStrategy(
  (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err)
      return done(err);
    if (!user) {
      console.log('User Not Found with username ' + username);
      return done(null, false);
    }
    if (!isValidPassword(user, password)) {
      console.log('Invalid Password');
      return done(null, false);
    }
    return done(null, user);
  });
  }
));
passport.use("local-register", new LocalStrategy({ 
  passReqToCallback: true },(req, username, password, done) => {
    User.findOne({ 'username': username }, function (err, user) {
      if (err) {
        console.log('Error in SignUp: ' + err);
        return done(err);
      }
      if (user) {
        console.log('User already exists');
        return done(null, false)
      }
      const newUser = {
        username: username,
        password: createHash(password),
      }
  User.create(newUser, (err, userWithId) => {
        if (err) {
          console.log('Error in Saving user: ' + err);
          return done(err);
        }
        console.log(user)
        console.log('User Registration succesful');
        return done(null, userWithId);
      });
    });
  })
)


/**SERIALIZATION */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/** DESERIALIZATION */
passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    console.log('user logeado');
    res.redirect("/");
  } else {
    console.log("user no logeado");
    res.render("login");
  }
});

router.post("/login", passport.authenticate('local-login',{failureRedirect: '/faillogin'}) ,(req, res) => {
  const user = req.user;
  res.redirect("/")
  
})

router.get("/register", (req, res) => {
  res.render("register");
})

router.post("/register", passport.authenticate('local-register',{failureRedirect: '/failregister'}), (req, res) => {
  let user = req.user;
  res.redirect("/");
})

router.get("/logout",  (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get('/faillogin', (req, res) => {
  console.log("error login");
  res.render("error", {msg: "login", redirect: "/login"});
});

router.get('/failregister', (req, res) => {
  console.log("error register");
  res.render("error", {msg: "signup", redirect: "/register"});
});

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

export default router;