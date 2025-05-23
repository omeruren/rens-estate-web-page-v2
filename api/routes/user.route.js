import express from "express";
import {
  deleteUser,
  getUserListings,
  test,
  updateUser,
  getUserInfo
} from "../controllers/user.controller.js";
import { verifyUserToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyUserToken, updateUser);
router.delete("/delete/:id", verifyUserToken, deleteUser);
router.get("/listings/:id", verifyUserToken, getUserListings);
router.get("/:id", verifyUserToken, getUserInfo);
export default router;
