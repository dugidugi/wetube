import express from "express";
import { see, edit, trending } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/", trending);
videoRouter.get("/watch", see);
videoRouter.get("/:id/edit", edit);

export default videoRouter;