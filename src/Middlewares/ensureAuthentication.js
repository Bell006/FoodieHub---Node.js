const { verify } = require("jsonwebtoken");
const AppError = require("../Utils/AppError");
const authConfig = require("../Configs/auth");

function ensureAuthentication(request, response, next) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError("JWT não informado", 401);
    }

    const [, token] = authHeader.split(" ");

    try {
        const {sub: user_id} = verify(token, authConfig.jwt.secret);

        request.user = {
            id: user_id
        };

        return next()
    } catch {
        throw new AppError("JWT inválido", 401);
    }
}

module.exports = ensureAuthentication;