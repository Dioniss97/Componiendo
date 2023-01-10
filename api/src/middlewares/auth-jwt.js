const jwt = require("jsonwebtoken");
const config = require("../config/auth-config");
const db = require("../models");

verifyUserToken = (req, res, next) => {

    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No se ha entregado el token."
        });
    }

    jwt.verify(token, config.user.secret, (err, decoded) => {

        if (err) {
            return res.status(401).send({
                message: "No tiene permiso."
            });
        }

        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyUserToken: verifyUserToken,
};

module.exports = authJwt;