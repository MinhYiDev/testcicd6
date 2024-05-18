class SuccessReponse {
    constructor({ statusCode = 200, message, metaData }) {
        this.statusCode = statusCode;
        this.message = message;
        this.metaData = metaData;
    }

    send(res) {
        return res.status(this.statusCode).json(this);
    }
}

class Register extends SuccessReponse {
    constructor({ statusCode = 201, message, metaData }) {
        super({ statusCode, message, metaData });
    }
}

class OK extends SuccessReponse {
    constructor({ statusCode = 200, message, metaData }) {
        super({ statusCode, message, metaData });
    }
}

export { SuccessReponse, Register, OK };
