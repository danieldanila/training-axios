const router = require("express").Router();
const userController = require("../controllers").UserController;

router.post("/create", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id/department", userController.updateUserDepartment);
router.get("/:id/department", userController.getUserDepartment);
router.post("/login", userController.userLogin);

module.exports = router;
