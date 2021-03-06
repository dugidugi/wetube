import User from "../models/User";
import bcrypt from "bcrypt";
import "dotenv/config";
import fetch from "node-fetch";
import req from "express/lib/request";

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

export const getEdit = (req, res) => {
    return res.render("edit-profile");
}

export const postEdit = async (req,res) => {
    const {
        session : { 
            user : {_id, avatarUrl}
        },
        body : {name, email, username, location},
        file
    } = req;

    console.log(req);

    if(email !== req.session.user.email){
        const emailExist = await User.findOne({email});
        if(emailExist){
            return res.status(400).render("edit-profile", {errorMessage: "existing Email!"});
        }
    }

    if(username !== req.session.user.username){
        const usernameExist = await User.findOne({username});
        if(usernameExist){
            return res.status(400).render("edit-profile", {errorMessage: "existing Username!"});
        }
    }
    
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name, email, username, location}, {new: true});
    req.session.user = updateUser;
    return res.redirect("/users/edit");
}

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

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        scope :  "read:user user:email",
        allow_signup : false,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async(req, res) => {
    const {code} = req.query;
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code
    };
    
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
        await fetch(finalUrl,{
            method: 'POST', 
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    const {access_token} = tokenRequest;
    
    //get userData, userEmail with token
    if(access_token){
        const userData = await(
            await fetch("https://api.github.com/user",{
                headers: {
                    Authorization : `token ${access_token}`
                }
            })
        ).json();

        const emailData = await(
            await fetch("https://api.github.com/user/emails",{
                headers: {
                    Authorization : `token ${access_token}`
                }
            })
        ).json();

        const userEmail = emailData.find(
            email => email.primary === true && email.verified === true
        );

        console.log(userEmail);

        if(!userEmail){
            res.redirect("/login");
        }

        const existingUser = await User.findOne({email : userEmail.email});
        if(existingUser){
            console.log("existing user!")
            req.session.loggedIn=true;
            req.session.user = existingUser;
            return res.redirect("/");
        }

        console.log("non-existing user!")
        const user = await User.create({
            name: userData.name, 
            username : userData.login, 
            socialOnly : true,
            password : "", 
            email: userEmail.email, 
            location : userData.location
        });
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }else{
        return res.redirect("/login");
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

export const see = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);

    if(!user){
        return res.status(400).render("404", {pageTitle: "User not found"})
    }
    return res.render("users/profile", {
        pageTitle: user.name,
        user
    });
}

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly){
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
    const { 
        session : {
            user : {_id}},
        body : {
            oldPassword, newPassword, newPasswordConfirm
        }
    } = req;

    const user = await User.findById({_id});
    const ok = await bcrypt.compare(oldPassword, user.password);
    
    if(!ok){
        return res.render("users/change-password", { pageTitle: "Change Password", errorMessage:"old Password not correct"});
    }
    
    if(newPassword !== newPasswordConfirm){
        return res.render("users/change-password", { pageTitle: "Change Password", errorMessage:"Password Confirm does not match"});
    }

    user.password = newPassword;
    await user.save();

    return res.redirect("/logout");
}

