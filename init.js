import "./db";
import Video from "./models/Video";
import app from "./server";

const PORT = 4000;
const handleListen = () => {console.log(`listening on ${PORT}`)}
app.listen(PORT, handleListen);