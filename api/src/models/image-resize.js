const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    const ImageResize = sequelize.define('ImageResize', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        imageConfigurationId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageOriginalId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        alt: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        path: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        entity: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        languageAlias: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        mimeType: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        grid: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sizeBytes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        widthPx: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        heightPx: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quality: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'image_resizes',
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
                name: "imageConfigurationId",
                using: "BTREE",
                fields: [
                    { name: "imageConfigurationId" },
                ]
            },
            {
                name: "imageOriginalId",
                using: "BTREE",
                fields: [
                    { name: "imageOriginalId" },
                ]
            },
            {
                name: "entityId",
                using: "BTREE",
                fields: [
                    { name: "entityId" },
                ]
            }
        ]
    });

    ImageResize.associate = function(models) {
        ImageResize.belongsTo(models.ImageConfiguration, { foreignKey: 'imageConfigurationId' });
        ImageResize.belongsTo(models.ImageOriginal, { foreignKey: 'imageOriginalId' });
    };

    return ImageResize;
};