module.exports = app => {
    
    const router = require('express').Router();
    const authJwt = require("../middlewares/auth-jwt.js");
    const controller = require("../controllers/admin/email-controller.js");

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post("/", [authJwt.verifyUserToken], controller.create);
    router.get("/", [authJwt.verifyUserToken], controller.findAll);
    router.get("/:id", [authJwt.verifyUserToken], controller.findOne);
    router.put("/:id", [authJwt.verifyUserToken], controller.update);
    router.delete("/:id", [authJwt.verifyUserToken], controller.delete);

    app.use('/api/admin/email', router);
};