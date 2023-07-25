const knex = require("../DataBase/knex");
const AppError = require("../Utils/AppError");
const DiskStorage = require("../Providers/DiskStorage");

class ItemImgController {
    async update(request, response) {
        const { id } = request.params;
        const imgFileName = request.file.filename;

        const diskStorage = new DiskStorage();

        const item = await knex("items").where({id}).first();

        if(!item) {
            throw new AppError("Item não encontrado", 401);
        }

        if(item.image) {
            await diskStorage.deleteFile(item.image);
        }

        await diskStorage.saveFile(imgFileName);

        item.image = imgFileName;
        await knex("items").where({id}).update({ image: imgFileName });

        return response.json(item)
    };
};

module.exports = ItemImgController;