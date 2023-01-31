module.exports = (app, upload) => {

    const router = require("express").Router();
    const controller = require("../controllers/admin/email-controller.js");
    const authJwt  = require("../middlewares/auth-jwt.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    let uploadFields = upload.fields([
      // Si tu quieres que un input pueda subir mas archivos a la vez el name del ipnut tiene que tener corchetes en este caso file[],
      // maxcount es el numero maximo de archivos que puede subir el input
      {name: 'flyer', maxCount: 1}
    ])

    router.get("/", [authJwt.verifyUserToken], controller.findAll);
    router.post("/", [authJwt.verifyUserToken, uploadFields], controller.create);
    // router.post("/send-email", [authJwt.verifyUserToken, uploadFields], controller.sendEmail);  
    router.get("/:id", [authJwt.verifyUserToken], controller.findOne);  
    router.put("/:id", [authJwt.verifyUserToken], controller.update);  
    router.delete("/:id", [authJwt.verifyUserToken], controller.delete);

    app.use('/api/admin/emails', router);
  };