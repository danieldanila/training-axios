const Department = require("../models").Department;
const User = require("../models").User;

const departmentfieldsValidation = async (departmentBody) => {
    const errors = [];

    if (!departmentBody.name) {
        errors.push("You must specify the department name.");
    } else if (departmentBody.name.length <= 3) {
        errors.push("The department name must have more than 3 characters.");
    } else {
        const result = await Department.findOne({
            where: { name: departmentBody.name },
        });

        if (result) {
            errors.push(`The '${departmentBody.name}' department name is already used.`);
        }
    }

    return errors;
};

const controller = {
    createDepartment: async (req, res) => {
        try {
            const departmentBody = {
                name: req.body.name,
            };

            const errors = await departmentfieldsValidation(departmentBody);

            if (errors.length === 0) {
                await Department.create(departmentBody);

                res.status(201).json({
                    message: `Department '${departmentBody.name}' created.`,
                });
            } else {
                res.status(400).json({ message: errors });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getAllDepartments: async (req, res) => {
        try {
            const departments = await Department.findAll();

            res.status(200).json(departments);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getDepartmentById: async (req, res) => {
        try {
            const department = await Department.findByPk(req.params.id);

            if (department) {
                res.status(200).json(department);
            } else {
                res.status(404).json({
                    message: `A department with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateDepartment: async (req, res) => {
        try {
            const department = await Department.findByPk(req.params.id);

            if (department) {
                const departmentBody = {
                    name: req.body.name,
                };

                const errors = await departmentfieldsValidation(departmentBody);

                if (errors.length === 0) {
                    const updatedDepartment = await department.update(departmentBody);

                    res.status(200).json({
                        data: updatedDepartment,
                        message: `The '${updatedDepartment.name}' department has been updated.`,
                    });
                } else {
                    res.status(400).json({ message: errors });
                }
            } else {
                res.status(404).json({
                    message: `A department with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteDepartment: async (req, res) => {
        try {
            const department = await Department.findByPk(req.params.id);

            if (department) {
                department.destroy();

                res.status(200).json({
                    message: `The '${department.name}' department was deleted.`,
                });
            } else {
                res.status(404).json({
                    message: `A department with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getDepartmentUsers: async (req, res) => {
        try {
            const department = await Department.findOne({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        model: User,
                    },
                ],
            });

            if (department) {
                res.status(200).json(department.Users);
            } else {
                res.status(404).json({
                    message: `A department with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = controller;
