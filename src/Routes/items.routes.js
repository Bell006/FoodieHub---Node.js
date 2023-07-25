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

itemsRoutes.post("/", ensureAuthentication,itemsController.Create);
itemsRoutes.patch("/img/:id", ensureAuthentication,upload.single("image"), itemImgController.update);
itemsRoutes.put("/update/:id",ensureAuthentication, itemsController.Update);
itemsRoutes.get("/details/:id", itemsController.Show);
itemsRoutes.get("/index", ensureAuthentication,itemsController.Index);
itemsRoutes.delete("/delete/:id", ensureAuthentication,itemsController.Delete);


module.exports = itemsRoutes;