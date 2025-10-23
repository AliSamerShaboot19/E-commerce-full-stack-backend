import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerConroller,
  testController,
  UpdateProfileController,
} from "../controller/authController.js";
import { isAdmin, requireSignUp } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", registerConroller);
router.post("/login", loginController);

router.post("/forgotpassword", forgotPasswordController);

router.get("/test", requireSignUp, isAdmin, testController);

router.get("/user-auth", requireSignUp, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignUp, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.put("/profile", requireSignUp, UpdateProfileController);

export default router;
