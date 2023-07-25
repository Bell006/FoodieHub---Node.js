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
        const decodedToken = verify(token, authConfig.jwt.secret);
        const adminCheck = decodedToken.adminCheck;

        request.user = {
            id: decodedToken.sub,
            adminCheck
        };

        return next()
    } catch {
        throw new AppError("JWT inválido", 401);
    }
}

module.exports = ensureAuthentication;