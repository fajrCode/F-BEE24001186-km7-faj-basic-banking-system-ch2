export class ErrorDbInput extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidInput';
    }
}

export class Error400 extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
}
