import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const handleListen = () => {console.log(`listening on ${PORT}`)}
app.listen(PORT, handleListen);
app.use(logger);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);