const fakeUser = {
    username: "Nicolas",
    loggedIn: false,
  };

const videos = [
    {
        title : "fuck",
        rating : 4,
        comments : 5,
        createdAt : "dd",
        views : 5
    }

];

export const trending = (req, res) => {
    res.render("home", { pageTitle: "Home", videos, fakeUser});
}
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");
export const search = (req, res) => res.send("Search");