const User = require("../models").User;
const Department = require("../models").Department;

const userfieldsValidation = async (userBody) => {
    const errors = [];

    if (!userBody.email || !userBody.password) {
        errors.push("You must specify an email and a password for the user.");
    } else if (userBody.password.length <= 3 || !userBody.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        errors.push(
            "The password must have more than 3 characters and the email must use example@domain.net format."
        );
    } else {
        const result = await User.findOne({
            where: { email: userBody.email },
        });

        if (result) {
            errors.push(`The '${userBody.email}' email is already used.`);
        }
    }

    return errors;
};

const controller = {
    createUser: async (req, res) => {
        try {
            const userBody = {
                email: req.body.email,
                password: req.body.password,
            };

            const errors = await userfieldsValidation(userBody);

            if (errors.length === 0) {
                await User.create(userBody);

                res.status(201).json({
                    message: `User with '${userBody.email}' email created.`,
                });
            } else {
                res.status(400).json({ message: errors });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                include: [
                    {
                        model: Department,
                    },
                ],
            });

            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id, {
                include: [
                    {
                        model: Department,
                    },
                ],
            });

            if (user) {
                return res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: `A user with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (user) {
                const userBody = {
                    email: req.body.email,
                    password: req.body.password,
                };

                const errors = await userfieldsValidation(userBody);

                if (errors.length === 0) {
                    const updatedUser = await user.update(userBody);

                    res.status(200).json({
                        data: updatedUser,
                        message: `The '${updatedUser.email}' user has been updated.`,
                    });
                } else {
                    res.status(400).json({ message: errors });
                }
            } else {
                res.status(404).json({
                    message: `A user with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (user) {
                user.destroy();

                res.status(200).json({
                    message: `The '${user.email}' user was deleted.`,
                });
            } else {
                res.status(404).json({
                    message: `A user with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateUserDepartment: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (user) {
                const userBody = {
                    idDepartment: req.body.idDepartment,
                };

                const errors = [];

                if (!userBody.idDepartment) {
                    errors.push(
                        "You must specify a idDepartment in order to update the user's department."
                    );
                }

                if (errors.length === 0) {
                    const department = await Department.findOne({
                        where: {
                            id: userBody.idDepartment,
                        },
                    });

                    if (department) {
                        const updatedUser = await user.update(userBody);

                        res.status(200).json({
                            data: updatedUser,
                            message: `The '${updatedUser.email}' user's department has been updated to '${department.name}'.`,
                        });
                    } else {
                        res.status(404).json({
                            message: `A department with the provided id: '${userBody.idDepartment}' doesn't exist.`,
                        });
                    }
                } else {
                    res.status(400).json({ message: errors });
                }
            } else {
                res.status(404).json({
                    message: `A user with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getUserDepartment: async (req, res) => {
        try {
            const user = await User.findOne({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        model: Department,
                    },
                ],
            });

            if (user) {
                res.status(200).json(user.Department);
            } else {
                res.status(404).json({
                    message: `A user with the provided id: '${req.params.id}' doesn't exist.`,
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    userLogin: async (req, res) => {
        try {
            const userBody = {
                email: req.body.email,
                password: req.body.password,
            };

            const errors = [];

            if (!userBody.email || !userBody.password) {
                errors.push("You must specify an email and a password to login.");
            }

            if (errors.length === 0) {
                const user = await User.findOne({
                    where: {
                        email: userBody.email,
                    },
                });

                if (user) {
                    if (user.password === userBody.password) {
                        res.status(200).json({ message: "Login succesful", data: user.id });
                    } else {
                        res.status(400).json({
                            message: "Credentials provided do not match with our records.",
                        });
                    }
                } else {
                    res.status(400).json({
                        message: "Credentials provided do not match with our records.",
                    });
                }
            } else {
                res.status(400).json({ message: errors });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = controller;
