function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.rhu_id) {
            return next();
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
}

function checkUserType(userType) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.user_type === userType && req.user.rhu_id) {
            return next();
        }
        res.redirect("/login");
    };
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        const user = req.user;
        switch (user.user_type) {
            case "medtech":
                return res.redirect("/medtech");
            case "nurse":
                return res.redirect("/nurse");
            case "doctor":
                return res.redirect("/doctor/dashboard");
            case "pharmacist":
                return res.redirect("/pharmacy/inventory");
            default:
                return res.redirect("/");
        }
    }
    next();
}

function checkRhuAccess(req, res, next) {
    if (req.isAuthenticated() && req.user.rhu_id) {
        const userRhuId = req.user.rhu_id;
        const patientRhuId = req.params.rhu_id || req.body.rhu_id;

        if (userRhuId === patientRhuId) {
            return next();
        } else {
            res.status(403).send('Access denied');
        }
    } else {
        res.redirect("/login");
    }
}

function setUserData(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.firstname = req.user.firstname;
        res.locals.surname = req.user.surname;
        res.locals.middle_initial = req.user.middle_initial;
        res.locals.profession = req.user.profession;
    } else {
        res.locals.firstname = null;
        res.locals.surname = null;
        res.locals.middle_initial = null;
        res.locals.profession = null;
    }
    next();
}

module.exports = {
    ensureAuthenticated,
    checkUserType,
    checkNotAuthenticated,
    checkRhuAccess,
    setUserData
};