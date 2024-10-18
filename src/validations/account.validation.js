import Joi from 'joi';

const createAccountValidator = Joi.object({
    userId: Joi.number().required(),
    bankName: Joi.string().min(3).max(30).required(),
    bankAccountNumber: Joi.string().min(10).max(10).required(),
    balance: Joi.number().required(),
});

export default createAccountValidator;