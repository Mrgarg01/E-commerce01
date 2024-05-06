class BadRequestError extends Error{
    constructor(message = 'Bad request') {
        super(message);
        this.status = 400;
    }
}

class InternaServerError extends Error{
    constructor(message = 'Internal Error') {
        super(message);
        this.status = 500;
    }
}

class NotFoundError extends Error{
    constructor(message = 'Not Found') {
        super(message);
        this.status = 404;
    }
}

module.exports = {
    BadRequestError,
    InternaServerError,
    NotFoundError
}