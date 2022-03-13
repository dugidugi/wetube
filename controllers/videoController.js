
export const handleWatchVideo = (req, res) => {
    return res.send("this is video watch");
}

export const handleVideoEdit = (req, res) =>{
    return res.send(`${req.params.id} edit`)
}