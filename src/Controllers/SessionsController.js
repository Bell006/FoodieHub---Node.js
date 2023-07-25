const knex = require("../DataBase/knex");
const AppError = require("../Utils/AppError");
const { compare } = require("bcryptjs");

const authConfig = require("../Configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body;

        if(!email || !password) {
            throw new AppError("Preencha todos os campos.");
        }

        const user = await knex("users").where({ email }).first();
  
        if(!user) {
            throw new AppError("Email e/ou senha incorretos.");
        }

        const adminCheck = Number(user.isAdmin);
        
        const passwordMatch = await compare(password, user.password);
        
        if(!passwordMatch) {
            throw new AppError("Email e/ou senha incorretos");
        }
        
        const { secret, expiresIn } = authConfig.jwt;
        
        const token = sign({ adminCheck }, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({user, token, adminCheck})
    }
}

module.exports = SessionsController;