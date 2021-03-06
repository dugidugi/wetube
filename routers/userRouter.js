import express from "express";
import { edit, remove, logout, see, startGithubLogin, finishGithubLogin, getEdit, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";
import { uploadAvatar } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/edit")
        .all(protectorMiddleware)
        .get(getEdit)
        .post(uploadAvatar.single("avatar"), postEdit);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);

export default userRouter;