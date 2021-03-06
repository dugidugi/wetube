import express from "express";
import {
  watch,
  getUpload,
  getEdit,
  postEdit,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, uploadVideo } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.all(protectorMiddleware).get("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter.all(protectorMiddleware).route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter
  .all(protectorMiddleware)
  .route("/upload")
  .get(getUpload)
  .post(uploadVideo.single("video"), postUpload);


export default videoRouter;