export const localsMiddleware = (req, res, next) => {
    res.locals.siteName="wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    console.log(res.locals);
    next();
};