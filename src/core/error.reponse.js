class ErrorReponse extends Error {
    constructor(status = 400, message) {
        super(message);
        this.status = status;
    }
}

class FORBIDDEN extends Error {
    constructor(status = 403, message) {
        super(message);
        this.status = status;
    }
}

export { ErrorReponse, FORBIDDEN };
