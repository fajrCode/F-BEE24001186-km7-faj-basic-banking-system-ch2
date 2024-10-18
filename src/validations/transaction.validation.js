import Joi from 'joi';

const createTransactionValidator = Joi.object({
    sourceAccountId: Joi.number().required(),
    destinationAccountId: Joi.number().required(),
    amount: Joi.number().greater(0).required(),
});

export default createTransactionValidator;