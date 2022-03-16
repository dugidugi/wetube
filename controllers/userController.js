import { redirect } from "express/lib/response";
import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    res.render("join");
};
export const postJoin = async(req, res) => {
    const {name, email, username, password, location} = req.body;

    const usernameExist = await User.exists({username});
    if(usernameExist){
        return res.status(400).render("join", {errorMessage: "Username is taken"});
    }
    const emailExist = await User.exists({email});
    if(emailExist){
        return res.status(400).render("join", {errorMessage: "email is taken"});
    }

    await User.create({name, email, username, password, location});
    return res.redirect("/login");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

export const getLogin = (req, res) => {
    const pageTitle = "Login"
    res.render("login", {pageTitle});
}
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if(!user){
        return res.status(400).render("login", {errorMessage: "Username not found"});
    }

    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {errorMessage: "Password is wrond"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
}

export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");