require("express-async-errors");

const express = require("express");
const AppError = require("./Utils/AppError");
const routes = require("./Routes");
const uploadConfig = require("./Configs/upload");

//Initializing Express
const app = express();
app.use(express.json());

//Using routes
app.use(routes);

//Setting files saving
app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER));


app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    };
    
    return [response.status(500).json({
        status: "error",
        message: "Internal server error"
    }), console.log(error)]
});








const PORT = 3333;


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


