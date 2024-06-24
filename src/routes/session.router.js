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

router.get("/allusers", sessionController.getAllUsers.bind(sessionController));

import upload from "../middleware/multer.js";
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "document" },
    { name: "products" },
    { name: "profile" },
  ]),
  sessionController.uploadDocuments.bind(sessionController)
);
router.delete(
  "/delete",
  sessionController.deleteInactiveUsers.bind(sessionController)
);

router.delete("/delete/:id", sessionController.deleteUserById);

router.put("/updateRole/:id", sessionController.updateUserRole);

export default router;
