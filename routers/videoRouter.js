import express from "express";
import { handleWatchVideo, handleVideoEdit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", handleWatchVideo);
videoRouter.get("/:id/edit", handleVideoEdit);

export default videoRouter;