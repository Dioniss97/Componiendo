// Aquí está el controlador de customer:

const db = require("../../models");
const Customer = db.Customer;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    if (!req.body.name || !req.body.surname || !req.body.identifyNumber || !req.body.onService || !req.body.postalCode || !req.body.address || !req.body.city || !req.body.province || !req.body.phone || !req.body.email) {

        res.status(400).send({
            message: "Faltan campos por rellenar."
        });

        return;
    }

    const customer = {
        name: req.body.name,
        surname: req.body.surname,
        identifyNumber: req.body.identifyNumber,
        onService: req.body.onService,
        startingServiceDate: req.body.startingServiceDate,
        postalCode: req.body.postalCode,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        phone: req.body.phone,
        email: req.body.email
    };

    Customer.create(customer).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al insertar el dato."
        });
    });
};

exports.findAll = (req, res) => {

    let whereStatement = {};
    whereStatement.onService = true;

    if(req.query.postalCode)
        whereStatement.postalCode = {[Op.like]: `%${req.query.postalCode}%`};

    if(req.query.city)
        whereStatement.city = {[Op.like]: `%${req.query.city}%`};

    if(req.query.startingServiceDate)
        whereStatement.startingServiceDate = {[Op.gte]: req.query.startingServiceDate};

    let condition = Object.keys(whereStatement).length > 0 ? {deletedAt: null} : { [Op.and]: [whereStatement, {deletedAt: null}] };

    Customer.findAll({ where: condition }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Customer.findByPk(id, {where: {deletedAt: null}}).then(data => {

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

    Customer.update(req.body, {
        where: { [Op.and]: [{id: id} , {deletedAt: null}] }
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

    Customer.destroy({
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