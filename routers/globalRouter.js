import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => {
    return res.send("hi this is home");
}
globalRouter.get("/", handleHome);

export default globalRouter;