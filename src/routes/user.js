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
//saveRedirectUrl middleware function is used to store the URL the user was trying to access before logging in. It's saved so that after login, the user can be redirected back to their original destination instead of being sent to a default page.
.post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), saveRedirectUrl, userController.logIn);

//logout router
router.get("/logout", userController.logOut);

module.exports = router;