import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views/");

app.use(
    session({
        secret: process.env.COOKIE_SECRET ,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
        resave: false,
        saveUninitialized: false,
    })
);


app.use(localsMiddleware);

app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/uploads", express.static("uploads"));

export default app;
