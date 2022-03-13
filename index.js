import express from "express";
import morgan from "morgan";

const app = express();

const PORT = 4000;
const handleListening = () => {
    console.log("Server is listening");
}

app.listen(PORT, handleListening);

const logger = morgan("dev");

const protecter = (req, res, next) => {
    if(req.url === "/protected"){
        res.send("not allowed");
    }
    next();
}

const handleHome = (req, res) => {
    return res.send("hi this is home");
}


app.use(logger);
app.use(protecter);
app.get("/", handleHome);