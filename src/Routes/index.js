const Router = require("express");

const usersRouter = require("./users.routes");
const itemsRouter = require("./items.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/items", itemsRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes;

