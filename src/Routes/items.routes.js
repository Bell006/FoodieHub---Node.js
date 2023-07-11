const { Router } = require("express");
const multer = require("multer");

const ensureAuthentication = require("../Middlewares/ensureAuthentication");
const ItemsController = require("../Controllers/ItemsController");
const ItemImgController = require("../Controllers/ItemImgController");
const uploadConfig = require("../Configs/upload");

const upload = multer(uploadConfig.MULTER);

const itemsRoutes = Router();

const itemImgController = new ItemImgController();
const itemsController = new ItemsController();

itemsRoutes.use(ensureAuthentication);

itemsRoutes.post("/", itemsController.Create);
itemsRoutes.patch("/img", upload.single("image"), itemImgController.update);
itemsRoutes.put("/update", itemsController.Update);
itemsRoutes.get("/details", itemsController.Show);
itemsRoutes.get("/index", itemsController.Index);
itemsRoutes.delete("/delete", itemsController.Delete);


module.exports = itemsRoutes;