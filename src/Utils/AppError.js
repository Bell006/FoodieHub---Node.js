class AppError {
    message;
    statusCode;
    
    constructor(message, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
    };

    printError() {
        console.error(`[${this.statusCode}] ${this.message}`);
    }
};

module.exports = AppError;