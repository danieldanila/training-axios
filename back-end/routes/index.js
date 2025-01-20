const router = require("express").Router();

const DatabaseRouter = require("./database.route");
const UserRouter = require("./user.route");
const DepartmentRouter = require("./department.route");

router.use("/database", DatabaseRouter);
router.use("/user", UserRouter);
router.use("/department", DepartmentRouter);

module.exports = router;
