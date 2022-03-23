export const localsMiddleware = (req, res, next) => {
    res.locals.siteName="Wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return res.redirect("/");
    }
    return next();
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return res.redirect("/");
    }
    return next();
}