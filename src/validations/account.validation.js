import Joi from 'joi';

const createAccountValidator = Joi.object({
    userId: Joi.number().required(),
    bankName: Joi.string().min(3).max(30).required(),
    bankAccountNumber: Joi.number().required(),
    balance: Joi.number().required(),
});

export default createAccountValidator;