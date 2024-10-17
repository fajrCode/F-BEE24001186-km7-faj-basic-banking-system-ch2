class InvalidInput extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidInput';
    }
}

class InvalidAmount extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidAmount';
    }
}

module.exports = { InvalidInput, InvalidAmount };
