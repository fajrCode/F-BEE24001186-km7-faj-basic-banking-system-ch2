export class ErrorDbInput extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidInput';
    }
}
