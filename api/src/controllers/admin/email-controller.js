const db = require("../../models");
const Email = db.Email;
const Op = db.Sequelize.Op;
const EmailService = require("../../services/email-service");
const ImageService = require("../../services/image-service");
const User = db.User;

exports.create = (req, res) => {

    if (!req.body.subject ||!req.body.content) {

        res.status(400).send({
            message: "Faltan campos por rellenar."
        });

        return;
    }

    const email = {
        subject: req.body.subject,
        content: req.body.content
    };

    Email.create(email).then(data => {

        new ImageService('email', data.id).uploadImage(req.files);

        res.status(200).send(data);
        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al insertar el dato."
        });
    });
};

exports.sendEmail = (req, res) => {

    if (!req.body.subject ||!req.body.content) {

        res.status(400).send({
            message: "Faltan campos por rellenar."
        });

        return;

    }

    // No es necesario crear el objeto email, porque ya lo tenemos en la base de datos

    Email.findByPk(req.body.id).then(data => {

        new EmailService().sendEmail(data);

        res.status(200).send(data);

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al insertar el dato."
        });
    });
};

exports.findAll = (req, res) => {

    let page = req.query.page || 1;
    let limit =  parseInt(req.query.size) || 10;
    let offset = (page - 1) * limit;

    let whereStatement = {};
    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    Email.findAndCountAll({
        where: condition,
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
    })
    .then(result => {

        result.meta = {
            total: result.count,
            pages: Math.ceil(result.count / limit),
            currentPage: page
        };

        res.status(200).send(result);

    }).catch(err => {
        res.status(500).send({
            message: err.errors || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Email.findByPk(id).then(data => {

        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se puede encontrar el elemento con la id=${id}.`
            });
        }

    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al recuperar la id=" + id
        });
    });
};

exports.update = (req, res) => {

    const id = req.params.id;

    Email.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "El elemento ha sido actualizado correctamente."
            });
        } else {
            res.status(404).send({
                message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al actualiazar la id=" + id
        });
    });
};

exports.delete = (req, res) => {

    const id = req.params.id;

    Email.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "El elemento ha sido borrado correctamente"
            });
        } else {
            res.status(404).send({
                message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al borrar la id=" + id
        });
    });
};