import express from "express";
import { handleUserEdit } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", handleUserEdit);

export default userRouter;