var DataTypes = require("sequelize").DataTypes;
var _Customer = require("./customer");
var _Email = require("./email");
var _SentEmail = require("./sent-email");
var _User = require("./user");

function initModels(sequelize) {
    var Customer = _Customer(sequelize, DataTypes);
    var Email = _Email(sequelize, DataTypes);
    var SentEmail = _SentEmail(sequelize, DataTypes);
    var User = _User(sequelize, DataTypes);

    SentEmail.belongsTo(Customer, { as: "customer", foreignKey: "customerId"});
    Customer.hasMany(SentEmail, { as: "sent_emails", foreignKey: "customerId"});
    SentEmail.belongsTo(Email, { as: "email", foreignKey: "emailId"});
    Email.hasMany(SentEmail, { as: "sent_emails", foreignKey: "emailId"});

    return {
        Customer,
        Email,
        SentEmail,
        User,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
