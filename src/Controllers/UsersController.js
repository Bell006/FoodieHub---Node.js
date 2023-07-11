const knex = require("../DataBase/knex");
const { hash, compare } = require("bcryptjs");
const AppError = require("../Utils/AppError");

class UsersController {

    async create(request, response) {
        const { name, email, password, isAdmin } = request.body;

        if(!name || !email || !password) {
            throw new AppError("Preencha todos os campos para prosseguir.");
        };

        const checkIfUserExists = await knex("users").where({email}).first();

        if(checkIfUserExists) {
            throw new AppError("O email inserido já está em uso.")
        }

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdmin ? true : false
        })

        return response.status(201).json("Usuário cadastrado com sucesso!");
    };
};

module.exports = UsersController;