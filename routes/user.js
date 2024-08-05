const express = require("express");
const router = express.Router();
const {saveRedirectUrl} = require("../middleware.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js");

//register router
router.route("/register")
.get(userController.signUpForm)
.post(wrapAsync(userController.signUp));

//login router
router.route("/login")
.get(userController.logInForm)
.post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), saveRedirectUrl, userController.logIn);

//logout router
router.get("/logout", userController.logOut);

module.exports = router;