const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    const MenuItem = sequelize.define('MenuItem', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        menuId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menus',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validator: {
                notNull: {
                    msg: 'Por favor, rellena el campo "Nombre".'
                }
            }
        },
        customUrl: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validator: {
                notNull: {
                    msg: 'Por favor, rellena el campo "URL personalizada".'
                }
            }
        }
    }, {
        sequelize,
        tableName: 'menu_items',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "menuId",
                using: "BTREE",
                fields: [
                    { name: "menuId" },
                ]
            }
        ]
    });

    MenuItem.associate = function(models) {
        MenuItem.belongsTo(models.Menu, { as: "menu", foreignKey: "menuId"});
    };

    return MenuItem;
};
