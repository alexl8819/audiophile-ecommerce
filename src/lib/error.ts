export class UnknownError extends Error {
    constructor (message: string) {
        super (message);
    }
}

export class ServiceUnavailableError extends Error {
    constructor (message: string) {
        super (message);
    }
}

export class ValidationViolationError extends Error {
    constructor (message: string) {
        super (message);
    }
}