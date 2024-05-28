import express from "express";
import passport from "passport";
const router = express.Router();

import SessionController from "../controllers/sessionController.js";
const sessionController = new SessionController();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/session/faillogin" }),
  sessionController.login
);

router.get("/faillogin", sessionController.failLogin);

router.get("/current", sessionController.current);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  sessionController.github
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  sessionController.githubCallBack
);

router.get("/logout", sessionController.logout);

router.put("/premium/:uid", sessionController.changeRolePremium);

export default router;
