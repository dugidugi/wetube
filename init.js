import "./db";
import Video from "./models/Video";
import User from "./models/User";
import app from "./server";

const PORT = 4000;
const handleListen = () => {console.log(`listening on ${PORT}`)}
app.listen(PORT, handleListen);