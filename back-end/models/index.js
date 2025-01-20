const { Sequelize, DataTypes } = require("sequelize");

const Database = require("../configs/database.config");

const UserModel = require("./user.model");
const DepartmentModel = require("./department.model");

const User = UserModel(Database, Sequelize);
const Department = DepartmentModel(Database, Sequelize);

Department.hasMany(User, {
    foreignKey: {
        name: "idDepartment",
        type: DataTypes.UUID,
        allowNull: true,
        validate: {
            isUUID: 4,
        },
    },
});
User.belongsTo(Department, {
    foreignKey: {
        name: "idDepartment",
        type: DataTypes.UUID,
        allowNull: true,
        validate: {
            isUUID: 4,
        },
    },
});

module.exports = {
    User,
    Department,
    connection: Database,
};
