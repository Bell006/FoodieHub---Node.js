const knex = require("../DataBase/knex");
const AppError = require("../Utils/AppError");

class ItemsController {
    async Create(request, response) {
        const { title, description, price, ingredients, category } = request.body;
        const user_id = request.user.id;

        if(!title || !description || !price || !ingredients || !category) {
            throw new AppError("Todos os campos são obrigatórios.")
        };

        await knex.transaction(async (trx) => {

            const checkIfItemExists = await trx("items").where({ title }).first();
            if(checkIfItemExists) {
                throw new AppError("Já existe um item cadastrado com o mesmo título.");
            };

            const [item] = await trx("items").insert({
                title,
                description,
                price: Number(price),
                category,
                user_id
            }).returning("*");

            const ingredientsData = ingredients.map((ingredient) => ({
                name: ingredient,
                item_id: item.id,
                user_id,
              }));

            await trx("ingredients").where({ item_id: item.id }).insert(ingredientsData);

            return response.status(201).json(item);
        })
    }

    async Update(request, response) {
        const { title, description, price, ingredients, category } = request.body;
        const { id: item_id } = request.params;
        const user_id = request.user.id;

        const item = await knex("items").where({id: item_id}).first();

        if(!item) {
            throw new AppError("Item não encontrado.")
        }

        item.title = title || item.title;
        item.description = description || item.description;
        item.price = price || item.price;
        item.category = category || item.category;

        if(ingredients) {
            const ingredientsData = ingredients.map((ingredient) => ({
                name: ingredient,
                item_id,
                user_id,
            }));
              
            await knex("ingredients").del().where({ item_id });  
            await knex("ingredients").where({ item_id }).insert(ingredientsData); 
        };
        
        await knex("items")
            .where({id: item_id})
            .update({
                title,
                description,
                price,
                category,
                user_id
        });

        return response.status(201).json("Item atualizado com sucesso!")

    }

    async Show(request, response) {
        const { id } = request.params;

        const item = await knex("items").where({ id }).first();

        const ingredients = await knex("ingredients")
        .where({item_id: id})
        .orderBy("name")
        .select("name")

        return response.status(201).json({...item, ingredients});
    }

    async Index(request, response) {
        const {title, ingredients} = request.query;
        const user_id = request.user.id;
        const adminCheck = request.user.adminCheck;
  
        let items;
        
        if(ingredients) {
            const filteredIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

            items = await knex("ingredients")
            .select([
                "items.id",
                "items.title",
                "items.user_id",
             ])
            .whereLike("ingredients.name", `%${ingredients}%`)
            .whereIn("name", filteredIngredients)
            .innerJoin("items", "items.id", "ingredients.item_id")
            .groupBy("items.id")
            .orderBy("items.title")
        }else if(title){
            items = await knex("items")
            .whereLike("title", `%${title}%`) //adequando a pesquisa do titulo para não precisar ser exato
            .orderBy("title")  
        } else if(adminCheck === 1 ){
            items = await knex("items")
            .where({user_id})
            .orderBy("title")  
        } else {
            items = await knex("items")
            .orderBy("title")  
        }

        const allIngredients = await knex.select().from("ingredients");

        const itemsAndIngredients = items.map(item => {
            const itemIngredients = allIngredients.filter(tag => tag.item_id === item.id)

            return {
                ...item,
                ingredient: itemIngredients
            }
        })

        return [response.status(201).json(itemsAndIngredients)]
    }

    async Delete(request, response) {
        const { id } = request.params;

        await knex("items").where({id}).delete();

        return response.status(201).json("Item deletado.")
    }
};

module.exports = ItemsController;